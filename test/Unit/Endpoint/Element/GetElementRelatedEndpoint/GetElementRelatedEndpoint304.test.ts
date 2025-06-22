import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementRelatedEndpoint } from '../../../../../src/Endpoint/Element';
import { CollectionParser, FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/def7d22b-9ad1-4256-9c80-e1d1bd401dd7/related', () => {
    return new HttpResponse(null, {
      status: 304,
      headers: {
        ETag: '"BCfc6KdsYc8"',
      },
    });
  }),
);

test('GetElementRelatedEndpoint should handle not modified response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const getElementRelatedEndpoint = new GetElementRelatedEndpoint(logger, fetchHelper, collectionParser);
  const parsedResponse = await getElementRelatedEndpoint.getElementRelated('def7d22b-9ad1-4256-9c80-e1d1bd401dd7');

  if ('data' in parsedResponse) {
    throw new Error('Expected parsed response to not contain data attribute.');
  }

  const response = parsedResponse.response;
  expect(response.status).toEqual(304);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/def7d22b-9ad1-4256-9c80-e1d1bd401dd7/related?page=1&pageSize=25',
  );
  mockServer.close();
});
