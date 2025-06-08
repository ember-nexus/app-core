import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { DeleteElementEndpoint } from '../../../../../src/Endpoint/Element';
import { Response404NotFoundError } from '../../../../../src/Error/Response404NotFoundError';
import { FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.delete('http://mock-api/c1978476-d672-4bd0-b8ab-c32701d56a28', () => {
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

test('DeleteElementEndpoint should handle bad response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const buildUrlSpy = vi.spyOn(fetchHelper, 'buildUrl');
  const getDefaultDeleteOptionsSpy = vi.spyOn(fetchHelper, 'getDefaultDeleteOptions');
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const deleteElementEndpoint = new DeleteElementEndpoint(logger, fetchHelper);
  await expect(deleteElementEndpoint.deleteElement('c1978476-d672-4bd0-b8ab-c32701d56a28')).rejects.toThrow(
    Response404NotFoundError,
  );

  expect(buildUrlSpy).toHaveBeenCalledExactlyOnceWith('/c1978476-d672-4bd0-b8ab-c32701d56a28');
  expect(getDefaultDeleteOptionsSpy).toHaveBeenCalledOnce();
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP DELETE request against URL: http://mock-api/c1978476-d672-4bd0-b8ab-c32701d56a28',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 404 not found.', expect.anything());
  mockServer.close();
});
