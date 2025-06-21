import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementEndpoint } from '../../../../../src/Endpoint/Element';
import { ElementParser, FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/b1e85bf9-6a79-4e50-ae5a-ed49beac8cb5', () => {
    return new HttpResponse(null, {
      status: 304,
      headers: {
        ETag: '"TMfc6KdsY3a"',
      },
    });
  }),
);

test('GetElementEndpoint should handle not modified response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const getElementEndpoint = new GetElementEndpoint(logger, fetchHelper, elementParser);
  const parsedResponse = await getElementEndpoint.getElement('b1e85bf9-6a79-4e50-ae5a-ed49beac8cb5');

  if ('data' in parsedResponse) {
    throw new Error('Expected parsed response to not contain data attribute.');
  }

  const response = parsedResponse.response;
  expect(response.status).toEqual(304);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/b1e85bf9-6a79-4e50-ae5a-ed49beac8cb5',
  );
  mockServer.close();
});
