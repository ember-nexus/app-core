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
    return HttpResponse.text('Some content which can not be interpreted as JSON.', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }),
);

test('GetTokenEndpoint should handle bad response error', async () => {
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
    'Unexpected Content-Type: "text/plain; charset=utf-8". Expected JSON-compatible format.',
    expect.anything(),
  );
  mockServer.close();
});
