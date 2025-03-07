import { ServiceIdentifier } from '../Type/Definition/index.js';

class ServiceResolver {
  private readonly services: Map<ServiceIdentifier, unknown> = new Map();

  constructor() {}

  set(serviceIdentifier: ServiceIdentifier, service: unknown): ServiceResolver {
    this.services.set(serviceIdentifier, service);
    return this;
  }

  has(serviceIdentifier: ServiceIdentifier): boolean {
    return this.services.has(serviceIdentifier);
  }

  get(serviceIdentifier: ServiceIdentifier): null | unknown {
    if (!this.has(serviceIdentifier)) {
      return null;
    }
    return this.services.get(serviceIdentifier);
  }

  getServiceIdentifiers(): ServiceIdentifier[] {
    return [...this.services.keys()];
  }

  clear(): ServiceResolver {
    this.services.clear();
    return this;
  }
}

export { ServiceResolver };
