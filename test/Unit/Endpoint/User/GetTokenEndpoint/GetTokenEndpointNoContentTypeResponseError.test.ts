import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetTokenEndpoint } from '../../../../../src/Endpoint/User/index.js';
import { ParseError } from '../../../../../src/Error/index.js';
import { ElementParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.get('http://mock-api/token', () => {
    const response = HttpResponse.text('Some content which can not be interpreted as JSON.', {
      status: 200,
    });
    response.headers.delete('Content-Type');
    return response;
  }),
);

test('GetTokenEndpoint should handle no content type response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getTokenEndpoint = new GetTokenEndpoint(logger, fetchHelper, elementParser);
  await expect(getTokenEndpoint.getToken()).rejects.toThrow(ParseError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/token',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Response does not contain a Content-Type header.',
    expect.anything(),
  );
  mockServer.close();
});
