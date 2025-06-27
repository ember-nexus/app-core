import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetMeEndpoint } from '../../../../../src/Endpoint/User/index.js';
import { LogicError } from '../../../../../src/Error/index.js';
import { ElementParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.get('http://mock-api/me', () => {
    return HttpResponse.json(
      {
        type: 'NotAUser',
        id: '2d376349-c5e2-42c8-8ce0-d6f525256cf7',
        data: {
          created: '2023-10-06T10:07:35+00:00',
          updated: '2023-10-06T10:07:35+00:00',
          name: 'User',
          email: 'anonymous-user@localhost.dev',
          note: 'User contains password only due to testing purposes.',
          password: '1234',
          scenario: 'general.anonymousUser',
        },
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }),
);

test('GetMeEndpoint should throw error if returned element is not an user', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getMeEndpoint = new GetMeEndpoint(logger, fetchHelper, elementParser);
  await expect(getMeEndpoint.getMe()).rejects.toThrow(LogicError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith('Executing HTTP GET request against URL: http://mock-api/me');
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith("Expected node to be of type 'User'.", expect.anything());
  mockServer.close();
});
