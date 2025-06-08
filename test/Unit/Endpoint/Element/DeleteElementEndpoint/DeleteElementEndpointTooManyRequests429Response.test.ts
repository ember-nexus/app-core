import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { DeleteElementEndpoint } from '../../../../../src/Endpoint/Element';
import { Response429TooManyRequestsError } from '../../../../../src/Error/Response429TooManyRequestsError';
import { FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.delete('http://mock-api/c653fae2-7f18-4bc9-abfb-929e60b57d72', () => {
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
  await expect(deleteElementEndpoint.deleteElement('c653fae2-7f18-4bc9-abfb-929e60b57d72')).rejects.toThrow(
    Response429TooManyRequestsError,
  );

  expect(buildUrlSpy).toHaveBeenCalledExactlyOnceWith('/c653fae2-7f18-4bc9-abfb-929e60b57d72');
  expect(getDefaultDeleteOptionsSpy).toHaveBeenCalledOnce();
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP DELETE request against URL: http://mock-api/c653fae2-7f18-4bc9-abfb-929e60b57d72',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 429 too many requests.', expect.anything());
  mockServer.close();
});
