import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostChangePasswordEndpoint } from '../../../../../src/Endpoint/User';
import { FetchHelper } from '../../../../../src/Service';
import { LoggerInterface, UniqueUserIdentifier } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.post('http://mock-api/change-password', () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {},
    });
  }),
);

test('PostChangePasswordEndpoint should handle node response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const postChangePasswordEndpoint = new PostChangePasswordEndpoint(logger, fetchHelper);
  await postChangePasswordEndpoint.postChangePassword('test@localhost.dev' as UniqueUserIdentifier, '1234', '4321');

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/change-password',
  );
  mockServer.close();
});
