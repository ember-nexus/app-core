import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { DeleteTokenEndpoint } from '../../../../../src/Endpoint/User/index.js';
import { ParseError } from '../../../../../src/Error/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.delete('http://mock-api/token', () => {
    return HttpResponse.text('Some content which can not be interpreted as JSON.', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }),
);

test('DeleteTokenEndpoint should handle bad response error', async () => {
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
    "Unable to parse response as content type is not 'application/problem+json'.",
    expect.anything(),
  );
  mockServer.close();
});
