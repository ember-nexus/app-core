type CacheEntry<T> = {
  data: T;
  etag: string | undefined;
};

export { CacheEntry };
