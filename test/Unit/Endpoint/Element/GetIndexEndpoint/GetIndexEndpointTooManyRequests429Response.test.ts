import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetIndexEndpoint } from '../../../../../src/Endpoint/Element';
import { Response429TooManyRequestsError } from '../../../../../src/Error';
import { CollectionParser, FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/', () => {
    return HttpResponse.json(
      {
        type: 'http://ember-nexus-api/error/429/too-many-requests',
        title: 'Unauthorized',
        status: 429,
        detail: 'wip',
      },
      {
        status: 429,
        headers: {
          'Content-Type': 'application/problem+json; charset=utf-8',
        },
      },
    );
  }),
);

test('GetIndexEndpoint should handle bad response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getIndexEndpoint = new GetIndexEndpoint(logger, fetchHelper, collectionParser);
  await expect(getIndexEndpoint.getIndex()).rejects.toThrow(Response429TooManyRequestsError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/?page=1&pageSize=25',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 429 too many requests.', expect.anything());
  mockServer.close();
});
