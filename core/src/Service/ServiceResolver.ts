import { ProxyObject, ServiceIdentifier } from '../Type/Definition/index.js';

class ServiceResolver {
  private readonly services: Map<ServiceIdentifier, ProxyObject<object>> = new Map();

  constructor() {}

  createServiceProxy<T extends object>(initialTarget: T): ProxyObject<T> {
    let currentTarget: T = initialTarget;

    const proxy = new Proxy({} as T, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get(_target, propertyKey, receiver): any {
        const value = Reflect.get(currentTarget, propertyKey, receiver);
        if (typeof value === 'function') {
          return value.bind(currentTarget);
        }
        return value;
      },
      set(_target, propertyKey, value): boolean {
        return Reflect.set(currentTarget, propertyKey, value);
      },
      has(_target, propertyKey): boolean {
        return propertyKey in currentTarget;
      },
      ownKeys(): (string | symbol)[] {
        return Reflect.ownKeys(currentTarget);
      },
      getOwnPropertyDescriptor(_target, propertyKey): PropertyDescriptor | undefined {
        const descriptor = Object.getOwnPropertyDescriptor(currentTarget, propertyKey);
        if (!descriptor) return undefined;
        return {
          ...descriptor,
          configurable: true,
        };
      },
      defineProperty(_target, propertyKey, descriptor): boolean {
        return Reflect.defineProperty(currentTarget, propertyKey, descriptor);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getPrototypeOf(): any {
        return Object.getPrototypeOf(currentTarget);
      },
    });

    return {
      proxy,
      targetReplaceFunction(newTarget: T): void {
        currentTarget = newTarget;
      },
    };
  }

  hasService(serviceIdentifier: ServiceIdentifier): boolean {
    return this.services.has(String(serviceIdentifier));
  }

  getService<T = object>(serviceIdentifier: ServiceIdentifier): null | T {
    const serviceEntry = this.services.get(String(serviceIdentifier));
    if (serviceEntry === undefined) {
      return null;
    }
    return serviceEntry.proxy as T;
  }

  getServiceOrFail<T = object>(serviceIdentifier: ServiceIdentifier): T {
    const serviceEntry = this.services.get(String(serviceIdentifier));
    if (serviceEntry === undefined) {
      throw new Error(`Requested service with identifier ${String(serviceIdentifier)} could not be resolved.`);
    }
    return serviceEntry.proxy as T;
  }

  setService(serviceIdentifier: ServiceIdentifier, service: object): ServiceResolver {
    let serviceEntry = this.services.get(String(serviceIdentifier));
    if (serviceEntry === undefined) {
      serviceEntry = this.createServiceProxy(service);
      this.services.set(String(serviceIdentifier), serviceEntry);
      return this;
    }
    serviceEntry.targetReplaceFunction(service);
    return this;
  }

  deleteService(serviceIdentifier: ServiceIdentifier): ServiceResolver {
    // todo: add warning that deleting and re-defining identical service identifiers will lead to issues
    // todo: add warning that already queried services will remain access to deleted service
    this.services.delete(String(serviceIdentifier));
    return this;
  }

  getServiceIdentifiers(): ServiceIdentifier[] {
    return [...this.services.keys()];
  }

  getServices(): unknown[] {
    return [...this.services.values()].map((service) => service.proxy);
  }

  clearServices(): ServiceResolver {
    this.services.clear();
    return this;
  }
}

export { ServiceResolver };
