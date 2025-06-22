import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementRelatedEndpoint } from '../../../../../src/Endpoint/Element';
import { Response403ForbiddenError } from '../../../../../src/Error';
import { CollectionParser, FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/bd186499-b2cb-4f03-a698-e5e416640c6f/related', () => {
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

test('GetElementRelatedEndpoint should handle forbidden error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementRelatedEndpoint = new GetElementRelatedEndpoint(logger, fetchHelper, collectionParser);
  await expect(getElementRelatedEndpoint.getElementRelated('bd186499-b2cb-4f03-a698-e5e416640c6f')).rejects.toThrow(
    Response403ForbiddenError,
  );

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/bd186499-b2cb-4f03-a698-e5e416640c6f/related?page=1&pageSize=25',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith('Server returned 403 forbidden.', expect.anything());
  mockServer.close();
});
