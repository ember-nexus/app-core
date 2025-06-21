import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { DeleteElementEndpoint } from '../../../../../src/Endpoint/Element';
import { FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.delete('http://mock-api/bd795d1d-00b4-4ee6-9b51-6d978b26aa96', () => {
    return HttpResponse.text('Some content which can not be interpreted as JSON.', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }),
);

test('DeleteElementEndpoint should handle bad response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const buildUrlSpy = vi.spyOn(fetchHelper, 'buildUrl');
  const getDefaultDeleteOptionsSpy = vi.spyOn(fetchHelper, 'getDefaultDeleteOptions');
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const deleteElementEndpoint = new DeleteElementEndpoint(logger, fetchHelper);
  await expect(deleteElementEndpoint.deleteElement('bd795d1d-00b4-4ee6-9b51-6d978b26aa96')).rejects.toThrow(
    "Unable to parse response as content type is not 'application/problem+json'.",
  );

  expect(buildUrlSpy).toHaveBeenCalledExactlyOnceWith('/bd795d1d-00b4-4ee6-9b51-6d978b26aa96');
  expect(getDefaultDeleteOptionsSpy).toHaveBeenCalledOnce();
  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP DELETE request against URL: http://mock-api/bd795d1d-00b4-4ee6-9b51-6d978b26aa96',
  );
  mockServer.close();
});
