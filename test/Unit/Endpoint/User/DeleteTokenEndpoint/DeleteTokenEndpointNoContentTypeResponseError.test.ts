import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { DeleteTokenEndpoint } from '../../../../../src/Endpoint/User';
import { ParseError } from '../../../../../src/Error';
import { FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.delete('http://mock-api/token', () => {
    const response = HttpResponse.text('Some content which can not be interpreted as JSON.', {
      status: 200,
    });
    response.headers.delete('Content-Type');
    return response;
  }),
);

test('DeleteTokenEndpoint should handle no content type response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const buildUrlSpy = vi.spyOn(fetchHelper, 'buildUrl');
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const deleteTokenEndpoint = new DeleteTokenEndpoint(logger, fetchHelper);
  await expect(deleteTokenEndpoint.deleteToken()).rejects.toThrow(ParseError);

  expect(buildUrlSpy).toHaveBeenCalledExactlyOnceWith('/token');
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP DELETE request against URL: http://mock-api/token',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Response does not contain content type header.',
    expect.anything(),
  );
  mockServer.close();
});
