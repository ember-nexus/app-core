import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementRelatedEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { ParseError } from '../../../../../src/Error/index.js';
import { CollectionParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.get('http://mock-api/1ed272d3-d4bf-4092-96a3-5f043356695b/related', () => {
    const response = HttpResponse.text('Some content which can not be interpreted as JSON.', {
      status: 200,
    });
    response.headers.delete('Content-Type');
    return response;
  }),
);

test('GetElementRelatedEndpoint should handle no content type response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementRelatedEndpoint = new GetElementRelatedEndpoint(logger, fetchHelper, collectionParser);
  await expect(getElementRelatedEndpoint.getElementRelated('1ed272d3-d4bf-4092-96a3-5f043356695b')).rejects.toThrow(
    ParseError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/1ed272d3-d4bf-4092-96a3-5f043356695b/related?page=1&pageSize=25',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Response does not contain a Content-Type header.',
    expect.anything(),
  );
  mockServer.close();
});
