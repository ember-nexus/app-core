import { ServiceIdentifier } from '../Type/Definition/index.js';

class ServiceResolver {
  private readonly services: Map<ServiceIdentifier, unknown> = new Map();

  constructor() {}

  hasService(serviceIdentifier: ServiceIdentifier): boolean {
    return this.services.has(serviceIdentifier);
  }

  getService(serviceIdentifier: ServiceIdentifier): null | unknown {
    if (!this.hasService(serviceIdentifier)) {
      return null;
    }
    return this.services.get(serviceIdentifier);
  }

  setService(serviceIdentifier: ServiceIdentifier, service: unknown): ServiceResolver {
    this.services.set(serviceIdentifier, service);
    return this;
  }

  deleteService(serviceIdentifier: ServiceIdentifier): ServiceResolver {
    this.services.delete(serviceIdentifier);
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
