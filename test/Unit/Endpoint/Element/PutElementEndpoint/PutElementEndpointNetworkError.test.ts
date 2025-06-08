import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PutElementEndpoint } from '../../../../../src/Endpoint/Element';
import { NetworkError } from '../../../../../src/Error';
import { FetchHelper } from '../../../../../src/Service';
import { Data } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.put('http://mock-api/547c1fba-4797-48fa-8e31-0b61f8e46a74', () => {
    return Response.error();
  }),
);

test('PutElementEndpoint should handle network error', async () => {
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
  await expect(putElementEndpoint.putElement('547c1fba-4797-48fa-8e31-0b61f8e46a74', data)).rejects.toThrow(
    NetworkError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP PUT request against URL: http://mock-api/547c1fba-4797-48fa-8e31-0b61f8e46a74',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Network error occurred during fetch.', expect.anything());
  mockServer.close();
});
