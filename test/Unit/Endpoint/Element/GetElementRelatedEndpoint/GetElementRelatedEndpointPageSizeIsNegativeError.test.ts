import { expect, test, vi } from 'vitest';

import { GetElementRelatedEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { ValidationError } from '../../../../../src/Error/index.js';
import { CollectionParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

test('GetElementRelatedEndpoint should throw error if page size is negative', async () => {
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementRelatedEndpoint = new GetElementRelatedEndpoint(logger, fetchHelper, collectionParser);
  await expect(
    getElementRelatedEndpoint.getElementRelated('c273602d-b764-47d4-8d5b-313263986bcc', 1, -3),
  ).rejects.toThrow(ValidationError);

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Page size must be at least 1.', expect.anything());
});
