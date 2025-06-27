import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PutElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { Response403ForbiddenError } from '../../../../../src/Error/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { Data } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.put('http://mock-api/dd1fdc6e-b15b-45a2-b8fd-e5b8ea567658', () => {
    return HttpResponse.json(
      {
        type: 'http://ember-nexus-api/error/403/forbiden',
        title: 'Forbidden',
        status: 403,
        detail: 'Requested endpoint, element or action is forbidden.',
      },
      {
        status: 403,
        headers: {
          'Content-Type': 'application/problem+json; charset=utf-8',
        },
      },
    );
  }),
);

test('PutElementEndpoint should handle forbidden error', async () => {
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
  await expect(putElementEndpoint.putElement('dd1fdc6e-b15b-45a2-b8fd-e5b8ea567658', data)).rejects.toThrow(
    Response403ForbiddenError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP PUT request against URL: http://mock-api/dd1fdc6e-b15b-45a2-b8fd-e5b8ea567658',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 403 forbidden.', expect.anything());
  mockServer.close();
});
