import { mock } from 'strong-mock';

import {
  ElementCache,
  ElementChildrenCache,
  ElementParentsCache,
  ElementRelatedCache,
  IndexCache,
} from '../../../../src/Cache/index.js';
import {
  DeleteElementEndpoint,
  GetElementChildrenEndpoint,
  GetElementEndpoint,
  GetElementParentsEndpoint,
  GetElementRelatedEndpoint,
  GetIndexEndpoint,
  PatchElementEndpoint,
  PostElementEndpoint,
  PostIndexEndpoint,
  PutElementEndpoint,
} from '../../../../src/Endpoint/Element/index.js';
import {
  DeleteTokenEndpoint,
  GetMeEndpoint,
  GetTokenEndpoint,
  PostChangePasswordEndpoint,
  PostRegisterEndpoint,
  PostTokenEndpoint,
} from '../../../../src/Endpoint/User/index.js';
import { ApiWrapper } from '../../../../src/Service/index.js';

function createApiWrapper(services: {
  getElementEndpoint?: GetElementEndpoint;
  getElementChildrenEndpoint?: GetElementChildrenEndpoint;
  getElementParentsEndpoint?: GetElementParentsEndpoint;
  getElementRelatedEndpoint?: GetElementRelatedEndpoint;
  getIndexEndpoint?: GetIndexEndpoint;
  postIndexEndpoint?: PostIndexEndpoint;
  postElementEndpoint?: PostElementEndpoint;
  putElementEndpoint?: PutElementEndpoint;
  patchElementEndpoint?: PatchElementEndpoint;
  deleteElementEndpoint?: DeleteElementEndpoint;
  postRegisterEndpoint?: PostRegisterEndpoint;
  postChangePasswordEndpoint?: PostChangePasswordEndpoint;
  getMeEndpoint?: GetMeEndpoint;
  postTokenEndpoint?: PostTokenEndpoint;
  getTokenEndpoint?: GetTokenEndpoint;
  deleteTokenEndpoint?: DeleteTokenEndpoint;
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
    services.postIndexEndpoint ?? mock<PostIndexEndpoint>(),
    services.postElementEndpoint ?? mock<PostElementEndpoint>(),
    services.putElementEndpoint ?? mock<PutElementEndpoint>(),
    services.patchElementEndpoint ?? mock<PatchElementEndpoint>(),
    services.deleteElementEndpoint ?? mock<DeleteElementEndpoint>(),
    services.postRegisterEndpoint ?? mock<PostRegisterEndpoint>(),
    services.postChangePasswordEndpoint ?? mock<PostChangePasswordEndpoint>(),
    services.getMeEndpoint ?? mock<GetMeEndpoint>(),
    services.postTokenEndpoint ?? mock<PostTokenEndpoint>(),
    services.getTokenEndpoint ?? mock<GetTokenEndpoint>(),
    services.deleteTokenEndpoint ?? mock<DeleteTokenEndpoint>(),
    services.elementCache ?? mock<ElementCache>(),
    services.elementChildrenCache ?? mock<ElementChildrenCache>(),
    services.elementParentsCache ?? mock<ElementParentsCache>(),
    services.elementRelatedCache ?? mock<ElementRelatedCache>(),
    services.indexCache ?? mock<IndexCache>(),
  );
}

export { createApiWrapper };
