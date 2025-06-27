import { expect, test, vi } from 'vitest';

import { GetElementParentsEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { ValidationError } from '../../../../../src/Error/index.js';
import { CollectionParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

test('GetElementParentsEndpoint should throw error if page is too small', async () => {
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementParentsEndpoint = new GetElementParentsEndpoint(logger, fetchHelper, collectionParser);
  await expect(getElementParentsEndpoint.getElementParents('abf83f6a-ffad-4c0c-9cfa-64be5225a69e', 0)).rejects.toThrow(
    ValidationError,
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Page number must be at least 1.', expect.anything());
});
