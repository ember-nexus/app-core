import { http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementChildrenEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { NetworkError } from '../../../../../src/Error/index.js';
import { CollectionParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.get('http://mock-api/206114e7-5708-426b-ba25-015d1acada72/children', () => {
    return Response.error();
  }),
);

test('GetElementChildrenEndpoint should handle network error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementChildrenEndpoint = new GetElementChildrenEndpoint(logger, fetchHelper, collectionParser);
  await expect(getElementChildrenEndpoint.getElementChildren('206114e7-5708-426b-ba25-015d1acada72')).rejects.toThrow(
    NetworkError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/206114e7-5708-426b-ba25-015d1acada72/children?page=1&pageSize=25',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Network error occurred during fetch.', expect.anything());
  mockServer.close();
});
