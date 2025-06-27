import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostTokenEndpoint } from '../../../../../src/Endpoint/User/index.js';
import { ParseError } from '../../../../../src/Error/index.js';
import { FetchHelper, TokenParser } from '../../../../../src/Service/index.js';
import { Data, LoggerInterface, UniqueUserIdentifier } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.post('http://mock-api/token', () => {
    const response = HttpResponse.text('Some content which can not be interpreted as JSON.', {
      status: 200,
    });
    response.headers.delete('Content-Type');
    return response;
  }),
);

test('PostTokenEndpoint should handle no content type response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const tokenParser = serviceResolver.getServiceOrFail<TokenParser>(ServiceIdentifier.serviceTokenParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const postTokenEndpoint = new PostTokenEndpoint(logger, tokenParser, fetchHelper);
  const data: Data = {
    some: 'data',
  };
  await expect(postTokenEndpoint.postToken('test@localhost.dev' as UniqueUserIdentifier, '1234', data)).rejects.toThrow(
    ParseError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/token',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Response does not contain a Content-Type header.',
    expect.anything(),
  );
  mockServer.close();
});
