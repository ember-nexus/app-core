import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostElementEndpoint } from '../../../../../src/Endpoint/Element';
import { ParseError } from '../../../../../src/Error';
import { FetchHelper } from '../../../../../src/Service';
import { NodeWithOptionalId } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.post('http://mock-api/377e1156-070d-4b35-86d0-738f455c1d07', () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        Location: '',
      },
    });
  }),
);

test('PostElementEndpoint should handle 204 response with empty location header', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const postElementEndpoint = new PostElementEndpoint(logger, fetchHelper);
  const element: NodeWithOptionalId = {
    type: 'Data',
    data: {
      hello: 'world',
    },
  };
  await expect(postElementEndpoint.postElement('377e1156-070d-4b35-86d0-738f455c1d07', element)).rejects.toThrow(
    ParseError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/377e1156-070d-4b35-86d0-738f455c1d07',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Passed variable is not a valid UUID v4.', expect.anything());
  mockServer.close();
});
