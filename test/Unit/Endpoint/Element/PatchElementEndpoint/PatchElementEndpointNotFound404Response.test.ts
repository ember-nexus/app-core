import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PatchElementEndpoint } from '../../../../../src/Endpoint/Element';
import { Response404NotFoundError } from '../../../../../src/Error';
import { FetchHelper } from '../../../../../src/Service';
import { Data } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.patch('http://mock-api/49650ebe-c5ae-48dc-a3c8-31e7ea44a8f0', () => {
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

test('PatchElementEndpoint should handle bad response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const patchElementEndpoint = new PatchElementEndpoint(logger, fetchHelper);
  const data: Data = {
    type: 'Data',
    data: {
      hello: 'world',
    },
  };
  await expect(patchElementEndpoint.patchElement('49650ebe-c5ae-48dc-a3c8-31e7ea44a8f0', data)).rejects.toThrow(
    Response404NotFoundError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP PATCH request against URL: http://mock-api/49650ebe-c5ae-48dc-a3c8-31e7ea44a8f0',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 404 not found.', expect.anything());
  mockServer.close();
});
