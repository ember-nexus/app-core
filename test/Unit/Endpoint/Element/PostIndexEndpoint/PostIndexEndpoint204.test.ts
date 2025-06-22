import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostIndexEndpoint } from '../../../../../src/Endpoint/Element';
import { FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { NodeWithOptionalId } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.post('http://mock-api/', () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        Location: '/455a89b9-4ec7-4b02-b023-bcfbcbba9a9f',
      },
    });
  }),
);

test('PostIndexEndpoint should handle 204 response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const postIndexEndpoint = new PostIndexEndpoint(logger, fetchHelper);
  const element: NodeWithOptionalId = {
    type: 'Data',
    data: {
      hello: 'world',
    },
  };
  const parsedResponse = await postIndexEndpoint.postIndex(element);

  const uuid = parsedResponse.data;
  expect(uuid).toEqual('455a89b9-4ec7-4b02-b023-bcfbcbba9a9f');

  const response = parsedResponse.response;
  expect(response.status).toEqual(204);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith('Executing HTTP POST request against URL: http://mock-api/');
  mockServer.close();
});
