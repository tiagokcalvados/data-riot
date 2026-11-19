import { get, put, BlobError, BlobPreconditionFailedError } from '@vercel/blob';

export function reactionStore(token = process.env.BLOB_READ_WRITE_TOKEN, path = process.env.VERCEL_ENV === 'preview' ? 'data-riot/reactions-preview-v1.json' : 'data-riot/reactions-v1.json') {
  if (!token) throw new Error('Reaction storage is not connected');
  return {
    async read() {
      const result = await get(path, { access: 'private', token, useCache: false, abortSignal: AbortSignal.timeout(8000) });
      if (!result) return null;
      if (result.blob.size > 4000000) throw new Error('Reaction storage size limit');
      return { etag: result.blob.etag, data: await new Response(result.stream).json() };
    },
    async write(data, etag) {
      const body = JSON.stringify(data);
      if (Buffer.byteLength(body) > 4000000) throw new Error('Reaction storage size limit');
      // The ETag makes each change conditional on the version we read. A
      // simultaneous vote retries rather than overwriting another visitor.
      await put(path, body, { token, access: 'private', addRandomSuffix: false, allowOverwrite: Boolean(etag), ...(etag ? { ifMatch: etag } : {}), contentType: 'application/json', cacheControlMaxAge: 60, multipart: false, abortSignal: AbortSignal.timeout(8000) });
    },
    isConflict(error) {
      // The SDK reports a simultaneous first creation as BlobError (400),
      // whereas later ETag conflicts use BlobPreconditionFailedError (412).
      return error instanceof BlobPreconditionFailedError || (error instanceof BlobError && /This blob already exists, use `allowOverwrite: true`/.test(error.message));
    },
  };
}
