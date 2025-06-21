import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { expect, test, vi } from 'vitest';

import { GetElementRelatedEndpoint } from '../../../../../src/Endpoint/Element';
import { ValidationError } from '../../../../../src/Error';
import { CollectionParser, FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

test('GetElementRelatedEndpoint should throw error if page is negative', async () => {
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementRelatedEndpoint = new GetElementRelatedEndpoint(logger, fetchHelper, collectionParser);
  await expect(getElementRelatedEndpoint.getElementRelated('8e6551fe-c631-4af1-8946-5a0f06d397fe', -3)).rejects.toThrow(
    ValidationError,
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Page number must be at least 1.', expect.anything());
});
