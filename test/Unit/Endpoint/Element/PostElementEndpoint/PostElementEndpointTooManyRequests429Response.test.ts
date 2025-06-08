import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostElementEndpoint } from '../../../../../src/Endpoint/Element';
import { Response429TooManyRequestsError } from '../../../../../src/Error';
import { FetchHelper } from '../../../../../src/Service';
import { NodeWithOptionalId } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.post('http://mock-api/a6aed16e-9a16-4ea4-953d-8a06badccec5', () => {
    return HttpResponse.json(
      {
        type: 'http://ember-nexus-api/error/429/too-many-requests',
        title: 'Unauthorized',
        status: 429,
        detail: 'wip',
      },
      {
        status: 429,
        headers: {
          'Content-Type': 'application/problem+json; charset=utf-8',
        },
      },
    );
  }),
);

test('PostElementEndpoint should handle bad response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const postElementEndpoint = new PostElementEndpoint(logger, fetchHelper);
  const element: NodeWithOptionalId = {
    type: 'Data',
    data: {
      hello: 'world',
    },
  };
  await expect(postElementEndpoint.postElement('a6aed16e-9a16-4ea4-953d-8a06badccec5', element)).rejects.toThrow(
    Response429TooManyRequestsError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/a6aed16e-9a16-4ea4-953d-8a06badccec5',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 429 too many requests.', expect.anything());
  mockServer.close();
});
