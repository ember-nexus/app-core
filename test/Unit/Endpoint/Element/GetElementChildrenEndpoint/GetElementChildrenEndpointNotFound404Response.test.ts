import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementChildrenEndpoint } from '../../../../../src/Endpoint/Element';
import { Response404NotFoundError } from '../../../../../src/Error';
import { CollectionParser, FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/f260b7e6-f228-4787-a6c7-41f0915e7e56/children', () => {
    return HttpResponse.json(
      {
        type: 'http://ember-nexus-api/error/404/not-found',
        title: 'NotFound',
        status: 404,
        detail: 'Requested element was not found.',
      },
      {
        status: 404,
        headers: {
          'Content-Type': 'application/problem+json; charset=utf-8',
        },
      },
    );
  }),
);

test('GetElementChildrenEndpoint should handle bad response error', async () => {
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
  await expect(getElementChildrenEndpoint.getElementChildren('f260b7e6-f228-4787-a6c7-41f0915e7e56')).rejects.toThrow(
    Response404NotFoundError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/f260b7e6-f228-4787-a6c7-41f0915e7e56/children?page=1&pageSize=25',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 404 not found.', expect.anything());
  mockServer.close();
});
