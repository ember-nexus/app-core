import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PatchElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { Data } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.patch('http://mock-api/0050c1f6-8be7-4615-bd3a-82d0f85d1f2d', () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
);

test('PatchElementEndpoint should handle 204 response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const patchElementEndpoint = new PatchElementEndpoint(logger, fetchHelper);
  const data: Data = {
    new: 'Data',
  };
  const emptyResponse = await patchElementEndpoint.patchElement('0050c1f6-8be7-4615-bd3a-82d0f85d1f2d', data);

  expect(emptyResponse.response.status).toEqual(204);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP PATCH request against URL: http://mock-api/0050c1f6-8be7-4615-bd3a-82d0f85d1f2d',
  );
  mockServer.close();
});
