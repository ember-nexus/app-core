import { ServiceResolver } from '../Service/index.js';
import { BrowserEventIdentifier } from '../Type/Enum/index.js';
import { customEventDefaultInit } from '../Type/Partial/index.js';

type GetServiceResolverEventDetails = {
  serviceResolver: ServiceResolver | null;
};

class GetServiceResolverEvent extends CustomEvent<GetServiceResolverEventDetails> {
  public static type = BrowserEventIdentifier.GetServiceResolver;
  constructor() {
    super(GetServiceResolverEvent.type, {
      ...customEventDefaultInit,
      detail: {
        serviceResolver: null,
      },
    });
  }

  getServiceResolver(): ServiceResolver | null {
    return this.detail.serviceResolver;
  }

  setServiceResolver(serviceResolver: ServiceResolver): void {
    this.detail.serviceResolver = serviceResolver;
  }
}

export { GetServiceResolverEvent, GetServiceResolverEventDetails };
