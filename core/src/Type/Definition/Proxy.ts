type ProxyReplaceFunction<T extends object> = (newTarget: T) => void;
type ProxyObject<T extends object> = {
  proxy: T;
  targetReplaceFunction: ProxyReplaceFunction<T>;
};

export { ProxyObject, ProxyReplaceFunction };
