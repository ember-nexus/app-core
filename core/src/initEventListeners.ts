import { GetServiceResolverEvent } from './BrowserEvent/index.js';
import { ServiceResolver } from './Service/index.js';
import { BrowserEventIdentifier } from './Type/Enum/index.js';

function initEventListeners(rootNode: HTMLElement, serviceResolver: ServiceResolver): void {
  rootNode.addEventListener(BrowserEventIdentifier.GetServiceResolver, (event: GetServiceResolverEvent) => {
    event.setServiceResolver(serviceResolver);
    event.stopPropagation();
  });
}

export { initEventListeners };
