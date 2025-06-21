import { ServiceIdentifier } from '../Type/Definition/index.js';

class ServiceResolver {
  private readonly services: Map<ServiceIdentifier, unknown> = new Map();

  constructor() {}

  hasService(serviceIdentifier: ServiceIdentifier): boolean {
    return this.services.has(String(serviceIdentifier));
  }

  getService<T = unknown>(serviceIdentifier: ServiceIdentifier): null | T {
    if (!this.hasService(String(serviceIdentifier))) {
      return null;
    }
    return this.services.get(String(serviceIdentifier)) as T;
  }

  getServiceOrFail<T = unknown>(serviceIdentifier: ServiceIdentifier): T {
    if (!this.hasService(String(serviceIdentifier))) {
      throw new Error(`Requested service with identifier ${String(serviceIdentifier)} could not be resolved.`);
    }
    return this.services.get(String(serviceIdentifier)) as T;
  }

  setService(serviceIdentifier: ServiceIdentifier, service: unknown): ServiceResolver {
    this.services.set(String(serviceIdentifier), service);
    return this;
  }

  deleteService(serviceIdentifier: ServiceIdentifier): ServiceResolver {
    this.services.delete(String(serviceIdentifier));
    return this;
  }

  getServiceIdentifiers(): ServiceIdentifier[] {
    return [...this.services.keys()];
  }

  getServices(): unknown[] {
    return [...this.services.values()];
  }

  clearServices(): ServiceResolver {
    this.services.clear();
    return this;
  }
}

export { ServiceResolver };
