import { expect, test, vi } from 'vitest';

import { GetElementChildrenEndpoint } from '../../../../../src/Endpoint/Element';
import { ValidationError } from '../../../../../src/Error';
import { CollectionParser, FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

test('GetElementChildrenEndpoint should throw error if page is too small', async () => {
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementChildrenEndpoint = new GetElementChildrenEndpoint(logger, fetchHelper, collectionParser);
  await expect(
    getElementChildrenEndpoint.getElementChildren('abf83f6a-ffad-4c0c-9cfa-64be5225a69e', 0),
  ).rejects.toThrow(ValidationError);

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Page number must be at least 1.', expect.anything());
});
