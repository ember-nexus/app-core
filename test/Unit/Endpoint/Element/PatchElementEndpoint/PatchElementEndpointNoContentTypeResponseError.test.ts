import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PatchElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { ParseError } from '../../../../../src/Error/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { Data } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.patch('http://mock-api/a89707ff-4720-44c3-b3be-6d054dd155a1', () => {
    const response = HttpResponse.text('Some content which can not be interpreted as JSON.', {
      status: 200,
    });
    response.headers.delete('Content-Type');
    return response;
  }),
);

test('PatchElementEndpoint should handle no content type response error', async () => {
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
  await expect(patchElementEndpoint.patchElement('a89707ff-4720-44c3-b3be-6d054dd155a1', data)).rejects.toThrow(
    ParseError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP PATCH request against URL: http://mock-api/a89707ff-4720-44c3-b3be-6d054dd155a1',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Response does not contain content type header.',
    expect.anything(),
  );
  mockServer.close();
});
