import { http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetTokenEndpoint } from '../../../../../src/Endpoint/User';
import { NetworkError } from '../../../../../src/Error';
import { ElementParser, FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/token', () => {
    return Response.error();
  }),
);

test('GetTokenEndpoint should handle network error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getTokenEndpoint = new GetTokenEndpoint(logger, fetchHelper, elementParser);
  await expect(getTokenEndpoint.getToken()).rejects.toThrow(NetworkError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/token',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Network error occurred during fetch.', expect.anything());
  mockServer.close();
});
