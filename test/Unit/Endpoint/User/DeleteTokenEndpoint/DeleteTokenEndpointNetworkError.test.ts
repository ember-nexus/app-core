import { http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { DeleteTokenEndpoint } from '../../../../../src/Endpoint/User/index.js';
import { NetworkError } from '../../../../../src/Error/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.delete('http://mock-api/token', () => {
    return Response.error();
  }),
);

test('DeleteTokenEndpoint should handle network error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const buildUrlSpy = vi.spyOn(fetchHelper, 'buildUrl');
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const deleteTokenEndpoint = new DeleteTokenEndpoint(logger, fetchHelper);
  await expect(deleteTokenEndpoint.deleteToken()).rejects.toThrow(NetworkError);

  expect(buildUrlSpy).toHaveBeenCalledExactlyOnceWith('/token');
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP DELETE request against URL: http://mock-api/token',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Network error occurred during fetch.', expect.anything());
  mockServer.close();
});
