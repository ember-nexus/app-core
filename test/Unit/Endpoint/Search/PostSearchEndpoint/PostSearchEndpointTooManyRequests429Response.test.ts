import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { PostSearchEndpoint } from '../../../../../src/Endpoint/Search/index.js';
import { Response429TooManyRequestsError } from '../../../../../src/Error/index.js';
import { FetchHelper } from '../../../../../src/Service/index.js';
import {LoggerInterface, SearchStep} from '../../../../../src/Type/Definition/index.js';
import {SearchStepType, ServiceIdentifier} from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.post('http://mock-api/search', () => {
    return HttpResponse.json(
      {
        type: 'http://ember-nexus-api/error/429/too-many-requests',
        title: 'Unauthorized',
        status: 429,
        detail: 'wip',
      },
      {
        status: 429,
        headers: {
          'Content-Type': 'application/problem+json; charset=utf-8',
        },
      },
    );
  }),
);

test('PostSearchEndpoint should handle bad response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const postElementEndpoint = new PostSearchEndpoint(logger, fetchHelper);
  const searchSteps: SearchStep[] = [
    {
      type: SearchStepType.CypherPathSubset,
      query: "MATCH path=((:Plant)) RETURN path LIMIT 5"
    },
    {
      type: SearchStepType.ElementHydration
    }
  ];
  await expect(postElementEndpoint.postSearch(searchSteps)).rejects.toThrow(
    Response429TooManyRequestsError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP POST request against URL: http://mock-api/search',
  );

  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 429 too many requests.', expect.anything());
  mockServer.close();
});
