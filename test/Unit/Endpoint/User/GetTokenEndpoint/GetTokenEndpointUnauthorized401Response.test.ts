import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetTokenEndpoint } from '../../../../../src/Endpoint/User';
import { Response401UnauthorizedError } from '../../../../../src/Error';
import { ElementParser, FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/token', () => {
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

test('GetTokenEndpoint should handle unauthorized response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getTokenEndpoint = new GetTokenEndpoint(logger, fetchHelper, elementParser);
  await expect(getTokenEndpoint.getToken()).rejects.toThrow(Response401UnauthorizedError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/token',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 401 unauthorized.', expect.anything());
  mockServer.close();
});
