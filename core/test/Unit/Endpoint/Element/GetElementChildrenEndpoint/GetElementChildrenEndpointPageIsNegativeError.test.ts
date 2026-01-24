import { expect, test, vi } from 'vitest';

import { GetElementChildrenEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { ValidationError } from '../../../../../src/Error/index.js';
import { CollectionParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

test('GetElementChildrenEndpoint should throw error if page is negative', async () => {
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementChildrenEndpoint = new GetElementChildrenEndpoint(logger, fetchHelper, collectionParser);
  await expect(
    getElementChildrenEndpoint.getElementChildren('8e6551fe-c631-4af1-8946-5a0f06d397fe', -3),
  ).rejects.toThrow(ValidationError);

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Page number must be at least 1.', expect.anything());
});
