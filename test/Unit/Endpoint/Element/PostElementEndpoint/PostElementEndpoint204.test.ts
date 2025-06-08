import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostElementEndpoint } from '../../../../../src/Endpoint/Element';
import { FetchHelper } from '../../../../../src/Service';
import { NodeWithOptionalId } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

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
  const uuid = await postElementEndpoint.postElement('8341cc07-5c67-4699-9a6b-47b95f6ea9a0', element);

  expect(uuid).to.equal('58473dde-e4ec-46fc-89c0-183af3205e51');
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/8341cc07-5c67-4699-9a6b-47b95f6ea9a0',
  );
  mockServer.close();
});
