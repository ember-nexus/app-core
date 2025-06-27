import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PutElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { Response401UnauthorizedError } from '../../../../../src/Error/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { Data } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.put('http://mock-api/bc4fa52e-c651-402b-a90b-665e96a8bd23', () => {
    return HttpResponse.json(
      {
        type: 'http://ember-nexus-api/error/401/unauthorized',
        title: 'Unauthorized',
        status: 401,
        detail:
          "Authorization for the request failed due to possible problems with the token (incorrect or expired), password (incorrect or changed), the user's unique identifier, or the user's status (e.g., missing, blocked, or deleted).",
      },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/problem+json; charset=utf-8',
        },
      },
    );
  }),
);

test('PutElementEndpoint should handle bad response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const putElementEndpoint = new PutElementEndpoint(logger, fetchHelper);
  const data: Data = {
    type: 'Data',
    data: {
      hello: 'world',
    },
  };
  await expect(putElementEndpoint.putElement('bc4fa52e-c651-402b-a90b-665e96a8bd23', data)).rejects.toThrow(
    Response401UnauthorizedError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP PUT request against URL: http://mock-api/bc4fa52e-c651-402b-a90b-665e96a8bd23',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 401 unauthorized.', expect.anything());
  mockServer.close();
});
