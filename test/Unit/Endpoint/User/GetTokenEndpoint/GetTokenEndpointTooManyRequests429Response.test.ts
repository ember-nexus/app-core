import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetTokenEndpoint } from '../../../../../src/Endpoint/User/index.js';
import { Response429TooManyRequestsError } from '../../../../../src/Error/index.js';
import { ElementParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.get('http://mock-api/token', () => {
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

test('GetTokenEndpoint should handle bad response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getTokenEndpoint = new GetTokenEndpoint(logger, fetchHelper, elementParser);
  await expect(getTokenEndpoint.getToken()).rejects.toThrow(Response429TooManyRequestsError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/token',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 429 too many requests.', expect.anything());
  mockServer.close();
});
