import { mock } from 'strong-mock';
import { expect, test } from 'vitest';

import {
  ElementCache,
  ElementChildrenCache,
  ElementParentsCache,
  ElementRelatedCache,
  IndexCache,
} from '../../../../src/Cache';
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
} from '../../../../src/Endpoint/Element';
import {
  DeleteTokenEndpoint,
  GetMeEndpoint,
  GetTokenEndpoint,
  PostChangePasswordEndpoint,
  PostRegisterEndpoint,
  PostTokenEndpoint,
} from '../../../../src/Endpoint/User';
import { ApiWrapper } from '../../../../src/Service';
import { buildEndpointServiceResolver } from '../../Endpoint/EndpointHelper';

test('create ApiWrapper from ServiceResolver', () => {
  const serviceResolver = buildEndpointServiceResolver();

  serviceResolver.setService(GetElementEndpoint.identifier, mock<GetElementEndpoint>());
  serviceResolver.setService(GetElementChildrenEndpoint.identifier, mock<GetElementChildrenEndpoint>());
  serviceResolver.setService(GetElementParentsEndpoint.identifier, mock<GetElementParentsEndpoint>());
  serviceResolver.setService(GetElementRelatedEndpoint.identifier, mock<GetElementRelatedEndpoint>());
  serviceResolver.setService(GetIndexEndpoint.identifier, mock<GetIndexEndpoint>());
  serviceResolver.setService(PostIndexEndpoint.identifier, mock<PostIndexEndpoint>());
  serviceResolver.setService(PostElementEndpoint.identifier, mock<PostElementEndpoint>());
  serviceResolver.setService(PatchElementEndpoint.identifier, mock<PatchElementEndpoint>());
  serviceResolver.setService(PutElementEndpoint.identifier, mock<PutElementEndpoint>());
  serviceResolver.setService(DeleteElementEndpoint.identifier, mock<DeleteElementEndpoint>());
  serviceResolver.setService(PostRegisterEndpoint.identifier, mock<PostRegisterEndpoint>());
  serviceResolver.setService(PostChangePasswordEndpoint.identifier, mock<PostChangePasswordEndpoint>());
  serviceResolver.setService(GetMeEndpoint.identifier, mock<GetMeEndpoint>());
  serviceResolver.setService(PostTokenEndpoint.identifier, mock<PostTokenEndpoint>());
  serviceResolver.setService(GetTokenEndpoint.identifier, mock<GetTokenEndpoint>());
  serviceResolver.setService(DeleteTokenEndpoint.identifier, mock<DeleteTokenEndpoint>());
  serviceResolver.setService(ElementCache.identifier, mock<ElementCache>());
  serviceResolver.setService(ElementChildrenCache.identifier, mock<ElementChildrenCache>());
  serviceResolver.setService(ElementParentsCache.identifier, mock<ElementParentsCache>());
  serviceResolver.setService(ElementRelatedCache.identifier, mock<ElementRelatedCache>());
  serviceResolver.setService(IndexCache.identifier, mock<IndexCache>());

  const apiWrapper = ApiWrapper.constructFromServiceResolver(serviceResolver);
  expect(apiWrapper).toBeInstanceOf(ApiWrapper);
});
