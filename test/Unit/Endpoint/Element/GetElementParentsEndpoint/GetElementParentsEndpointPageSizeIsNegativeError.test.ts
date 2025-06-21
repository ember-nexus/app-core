import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { expect, test, vi } from 'vitest';

import { GetElementParentsEndpoint } from '../../../../../src/Endpoint/Element';
import { ValidationError } from '../../../../../src/Error';
import { CollectionParser, FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

test('GetElementParentsEndpoint should throw error if page size is negative', async () => {
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementParentsEndpoint = new GetElementParentsEndpoint(logger, fetchHelper, collectionParser);
  await expect(
    getElementParentsEndpoint.getElementParents('c273602d-b764-47d4-8d5b-313263986bcc', 1, -3),
  ).rejects.toThrow(ValidationError);

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Page size must be at least 1.', expect.anything());
});
