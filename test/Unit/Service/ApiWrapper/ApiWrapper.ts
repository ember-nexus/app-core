import { mock } from 'strong-mock';

import {
  ElementCache,
  ElementChildrenCache,
  ElementParentsCache,
  ElementRelatedCache,
  IndexCache,
} from '../../../../src/Cache';
import {
  GetElementChildrenEndpoint,
  GetElementEndpoint,
  GetElementParentsEndpoint,
  GetElementRelatedEndpoint,
  GetIndexEndpoint,
} from '../../../../src/Endpoint/Element';
import { ApiWrapper } from '../../../../src/Service';

function createApiWrapper(services: {
  getElementEndpoint?: GetElementEndpoint;
  getElementChildrenEndpoint?: GetElementChildrenEndpoint;
  getElementParentsEndpoint?: GetElementParentsEndpoint;
  getElementRelatedEndpoint?: GetElementRelatedEndpoint;
  getIndexEndpoint?: GetIndexEndpoint;
  elementCache?: ElementCache;
  elementChildrenCache?: ElementChildrenCache;
  elementParentsCache?: ElementParentsCache;
  elementRelatedCache?: ElementRelatedCache;
  indexCache?: IndexCache;
}): ApiWrapper {
  return new ApiWrapper(
    services.getElementEndpoint ?? mock<GetElementEndpoint>(),
    services.getElementChildrenEndpoint ?? mock<GetElementChildrenEndpoint>(),
    services.getElementParentsEndpoint ?? mock<GetElementParentsEndpoint>(),
    services.getElementRelatedEndpoint ?? mock<GetElementRelatedEndpoint>(),
    services.getIndexEndpoint ?? mock<GetIndexEndpoint>(),
    services.elementCache ?? mock<ElementCache>(),
    services.elementChildrenCache ?? mock<ElementChildrenCache>(),
    services.elementParentsCache ?? mock<ElementParentsCache>(),
    services.elementRelatedCache ?? mock<ElementRelatedCache>(),
    services.indexCache ?? mock<IndexCache>(),
  );
}

export { createApiWrapper };
