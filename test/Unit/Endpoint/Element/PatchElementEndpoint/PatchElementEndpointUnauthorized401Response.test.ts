import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PatchElementEndpoint } from '../../../../../src/Endpoint/Element';
import { Response401UnauthorizedError } from '../../../../../src/Error';
import { FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { Data } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.patch('http://mock-api/2fe3ba3b-c44c-45b8-a427-4724c46f9951', () => {
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

test('PatchElementEndpoint should handle unauthorized response error', async () => {
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
  await expect(patchElementEndpoint.patchElement('2fe3ba3b-c44c-45b8-a427-4724c46f9951', data)).rejects.toThrow(
    Response401UnauthorizedError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP PATCH request against URL: http://mock-api/2fe3ba3b-c44c-45b8-a427-4724c46f9951',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 401 unauthorized.', expect.anything());
  mockServer.close();
});
