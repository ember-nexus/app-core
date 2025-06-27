import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostIndexEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { Response404NotFoundError } from '../../../../../src/Error/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { NodeWithOptionalId } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.post('http://mock-api/', () => {
    return HttpResponse.json(
      {
        type: 'http://ember-nexus-api/error/404/not-found',
        title: 'NotFound',
        status: 404,
        detail: 'Requested element was not found.',
      },
      {
        status: 404,
        headers: {
          'Content-Type': 'application/problem+json; charset=utf-8',
        },
      },
    );
  }),
);

test('PostIndexEndpoint should handle bad response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const postIndexEndpoint = new PostIndexEndpoint(logger, fetchHelper);
  const element: NodeWithOptionalId = {
    type: 'Data',
    data: {
      hello: 'world',
    },
  };
  await expect(postIndexEndpoint.postIndex(element)).rejects.toThrow(Response404NotFoundError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith('Executing HTTP POST request against URL: http://mock-api/');

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 404 not found.', expect.anything());
  mockServer.close();
});
