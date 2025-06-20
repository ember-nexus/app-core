import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostRegisterEndpoint } from '../../../../../src/Endpoint/User';
import { FetchHelper } from '../../../../../src/Service';
import { LoggerInterface, UniqueUserIdentifier } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.post('http://mock-api/register', () => {
    return new HttpResponse(null, {
      status: 201,
      headers: {
        Location: '/a5f95955-1d24-43db-8832-f365e6a96dfa',
      },
    });
  }),
);

test('PostRegisterEndpoint should handle node response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const postRegisterEndpoint = new PostRegisterEndpoint(logger, fetchHelper);
  const parsedResponse = await postRegisterEndpoint.postRegister('test@localhost.dev' as UniqueUserIdentifier, '1234');

  const uuid = parsedResponse.data;
  expect(uuid).toEqual('a5f95955-1d24-43db-8832-f365e6a96dfa');

  const response = parsedResponse.response;
  expect(response.status).toEqual(201);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/register',
  );
  mockServer.close();
});
