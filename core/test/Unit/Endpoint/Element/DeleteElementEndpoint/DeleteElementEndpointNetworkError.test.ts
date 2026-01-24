import { http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { DeleteElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.delete('http://mock-api/13be6cab-fb8f-462d-b925-a5a9368e5e2f', () => {
    return Response.error();
  }),
);

test('DeleteElementEndpoint should handle network error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const buildUrlSpy = vi.spyOn(fetchHelper, 'buildUrl');
  const getDefaultDeleteOptionsSpy = vi.spyOn(fetchHelper, 'getDefaultDeleteOptions');
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const deleteElementEndpoint = new DeleteElementEndpoint(logger, fetchHelper);
  await expect(deleteElementEndpoint.deleteElement('13be6cab-fb8f-462d-b925-a5a9368e5e2f')).rejects.toThrow(
    'Network error occurred during fetch.',
  );

  expect(buildUrlSpy).toHaveBeenCalledExactlyOnceWith('/13be6cab-fb8f-462d-b925-a5a9368e5e2f');
  expect(getDefaultDeleteOptionsSpy).toHaveBeenCalledOnce();
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP DELETE request against URL: http://mock-api/13be6cab-fb8f-462d-b925-a5a9368e5e2f',
  );
  mockServer.close();
});
