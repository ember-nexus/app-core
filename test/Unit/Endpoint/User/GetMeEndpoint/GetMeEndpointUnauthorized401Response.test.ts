import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetMeEndpoint } from '../../../../../src/Endpoint/User/index.js';
import { Response401UnauthorizedError } from '../../../../../src/Error/index.js';
import { ElementParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.get('http://mock-api/me', () => {
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

test('GetMeEndpoint should handle unauthorized response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getMeEndpoint = new GetMeEndpoint(logger, fetchHelper, elementParser);
  await expect(getMeEndpoint.getMe()).rejects.toThrow(Response401UnauthorizedError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith('Executing HTTP GET request against URL: http://mock-api/me');
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 401 unauthorized.', expect.anything());
  mockServer.close();
});
