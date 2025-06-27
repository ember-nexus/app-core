import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementParentsEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { Response403ForbiddenError } from '../../../../../src/Error/index.js';
import { CollectionParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.get('http://mock-api/495d4dce-6ecc-4f45-bff6-c576e3762934/parents', () => {
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

test('GetElementParentsEndpoint should handle forbidden error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementParentsEndpoint = new GetElementParentsEndpoint(logger, fetchHelper, collectionParser);
  await expect(getElementParentsEndpoint.getElementParents('495d4dce-6ecc-4f45-bff6-c576e3762934')).rejects.toThrow(
    Response403ForbiddenError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/495d4dce-6ecc-4f45-bff6-c576e3762934/parents?page=1&pageSize=25',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 403 forbidden.', expect.anything());
  mockServer.close();
});
