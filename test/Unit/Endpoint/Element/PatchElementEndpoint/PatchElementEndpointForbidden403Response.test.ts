import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PatchElementEndpoint } from '../../../../../src/Endpoint/Element';
import { Response403ForbiddenError } from '../../../../../src/Error';
import { FetchHelper } from '../../../../../src/Service';
import { Data } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.patch('http://mock-api/dff734bb-7aab-401d-bea4-1c74348c9a02', () => {
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

test('PatchElementEndpoint should handle forbidden error', async () => {
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
  await expect(patchElementEndpoint.patchElement('dff734bb-7aab-401d-bea4-1c74348c9a02', data)).rejects.toThrow(
    Response403ForbiddenError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP PATCH request against URL: http://mock-api/dff734bb-7aab-401d-bea4-1c74348c9a02',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 403 forbidden.', expect.anything());
  mockServer.close();
});
