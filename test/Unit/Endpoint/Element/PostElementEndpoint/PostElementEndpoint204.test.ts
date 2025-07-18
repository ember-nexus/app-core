import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { NodeWithOptionalId } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.post('http://mock-api/8341cc07-5c67-4699-9a6b-47b95f6ea9a0', () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        Location: '/58473dde-e4ec-46fc-89c0-183af3205e51',
      },
    });
  }),
);

test('PostElementEndpoint should handle 204 response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const postElementEndpoint = new PostElementEndpoint(logger, fetchHelper);
  const element: NodeWithOptionalId = {
    type: 'Data',
    data: {
      hello: 'world',
    },
  };
  const parsedResponse = await postElementEndpoint.postElement('8341cc07-5c67-4699-9a6b-47b95f6ea9a0', element);

  const uuid = parsedResponse.data;
  expect(uuid).toEqual('58473dde-e4ec-46fc-89c0-183af3205e51');

  const response = parsedResponse.response;
  expect(response.status).toEqual(204);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/8341cc07-5c67-4699-9a6b-47b95f6ea9a0',
  );
  mockServer.close();
});
