import { expect, test, vi } from 'vitest';

import { GetElementParentsEndpoint } from '../../../../../src/Endpoint/Element';
import { ValidationError } from '../../../../../src/Error';
import { CollectionParser, FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

test('GetElementParentsEndpoint should throw error if page size is too small', async () => {
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementParentsEndpoint = new GetElementParentsEndpoint(logger, fetchHelper, collectionParser);
  await expect(
    getElementParentsEndpoint.getElementParents('5d69b32f-f000-4c4d-b925-b21ea1dfed60', 1, 0),
  ).rejects.toThrow(ValidationError);

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Page size must be at least 1.', expect.anything());
});
