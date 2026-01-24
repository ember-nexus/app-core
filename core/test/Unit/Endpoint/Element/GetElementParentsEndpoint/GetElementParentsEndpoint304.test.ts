import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementParentsEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { CollectionParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.get('http://mock-api/519fb22b-6b0c-403a-947f-eec3f9ac9209/parents', () => {
    return new HttpResponse(null, {
      status: 304,
      headers: {
        ETag: '"BCfc6KdsYc8"',
      },
    });
  }),
);

test('GetElementParentsEndpoint should handle not modified response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const getElementParentsEndpoint = new GetElementParentsEndpoint(logger, fetchHelper, collectionParser);
  const parsedResponse = await getElementParentsEndpoint.getElementParents('519fb22b-6b0c-403a-947f-eec3f9ac9209');

  if ('data' in parsedResponse) {
    throw new Error('Expected parsed response to not contain data attribute.');
  }

  const response = parsedResponse.response;
  expect(response.status).toEqual(304);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/519fb22b-6b0c-403a-947f-eec3f9ac9209/parents?page=1&pageSize=25',
  );
  mockServer.close();
});
