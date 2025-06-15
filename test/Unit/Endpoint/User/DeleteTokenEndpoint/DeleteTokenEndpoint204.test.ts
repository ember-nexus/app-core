import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { DeleteTokenEndpoint } from '../../../../../src/Endpoint/User';
import { FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.delete('http://mock-api/token', () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
);

test('DeleteTokenEndpoint should handle 204 response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const buildUrlSpy = vi.spyOn(fetchHelper, 'buildUrl');
  const getDefaultDeleteOptionsSpy = vi.spyOn(fetchHelper, 'getDefaultDeleteOptions');
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const deleteElementEndpoint = new DeleteTokenEndpoint(logger, fetchHelper);
  const emptyResponse = await deleteElementEndpoint.deleteToken();

  expect(emptyResponse.response.status).to.equal(204);

  expect(buildUrlSpy).toHaveBeenCalledExactlyOnceWith('/token');
  expect(getDefaultDeleteOptionsSpy).toHaveBeenCalledOnce();
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP DELETE request against URL: http://mock-api/token',
  );
  mockServer.close();
});
