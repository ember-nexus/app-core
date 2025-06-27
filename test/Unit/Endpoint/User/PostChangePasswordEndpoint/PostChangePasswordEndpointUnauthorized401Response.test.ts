import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostChangePasswordEndpoint } from '../../../../../src/Endpoint/User/index.js';
import { Response401UnauthorizedError } from '../../../../../src/Error/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { UniqueUserIdentifier } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.post('http://mock-api/change-password', () => {
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

test('PostChangePasswordEndpoint should handle unauthorized response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const postChangePasswordEndpoint = new PostChangePasswordEndpoint(logger, fetchHelper);
  await expect(
    postChangePasswordEndpoint.postChangePassword('test@localhost.dev' as UniqueUserIdentifier, '1234', '4321'),
  ).rejects.toThrow(Response401UnauthorizedError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/change-password',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 401 unauthorized.', expect.anything());
  mockServer.close();
});
