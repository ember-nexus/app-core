import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { DeleteElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.delete('http://mock-api/52965378-8305-43bf-a637-b24d0d29c1c9', () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
);

test('DeleteElementEndpoint should handle 204 response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const buildUrlSpy = vi.spyOn(fetchHelper, 'buildUrl');
  const getDefaultDeleteOptionsSpy = vi.spyOn(fetchHelper, 'getDefaultDeleteOptions');
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const deleteElementEndpoint = new DeleteElementEndpoint(logger, fetchHelper);
  const emptyResponse = await deleteElementEndpoint.deleteElement('52965378-8305-43bf-a637-b24d0d29c1c9');

  expect(emptyResponse.response.status).toEqual(204);

  expect(buildUrlSpy).toHaveBeenCalledExactlyOnceWith('/52965378-8305-43bf-a637-b24d0d29c1c9');
  expect(getDefaultDeleteOptionsSpy).toHaveBeenCalledOnce();
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP DELETE request against URL: http://mock-api/52965378-8305-43bf-a637-b24d0d29c1c9',
  );
  mockServer.close();
});
