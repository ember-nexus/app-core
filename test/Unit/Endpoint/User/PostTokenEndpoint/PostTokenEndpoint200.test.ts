import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostTokenEndpoint } from '../../../../../src/Endpoint/User';
import { FetchHelper, TokenParser } from '../../../../../src/Service';
import { Data, LoggerInterface, UniqueUserIdentifier } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.post('http://mock-api/token', () => {
    return HttpResponse.json(
      {
        type: '_TokenResponse',
        token: 'secret-token:ERgAAnWl0CY8bQs0m11nZ3',
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }),
);

test('PostTokenEndpoint should handle node response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const tokenParser = serviceResolver.getServiceOrFail<TokenParser>(ServiceIdentifier.serviceTokenParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const postTokenEndpoint = new PostTokenEndpoint(logger, tokenParser, fetchHelper);
  const data: Data = {
    some: 'data',
  };
  const token = await postTokenEndpoint.postToken('test@localhost.dev' as UniqueUserIdentifier, '1234', data);

  expect(token).to.equal('secret-token:ERgAAnWl0CY8bQs0m11nZ3');
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/token',
  );
  mockServer.close();
});
