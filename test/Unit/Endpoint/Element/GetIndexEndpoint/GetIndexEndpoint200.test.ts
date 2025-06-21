import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetIndexEndpoint } from '../../../../../src/Endpoint/Element';
import { CollectionParser, FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/', () => {
    return HttpResponse.json(
      {
        type: '_PartialCollection',
        id: '/',
        totalNodes: 2,
        links: {
          first: '/',
          previous: null,
          next: null,
          last: '/',
        },
        nodes: [
          {
            type: 'Tag',
            id: '45482998-274a-43d0-a466-f31d0b24cc0a',
            data: {
              created: '2023-10-25T10:44:39+00:00',
              updated: '2023-10-25T10:44:39+00:00',
              name: 'Yellow',
              color: '#FFC835',
            },
          },
          {
            type: 'Tag',
            id: '6b8341ca-851a-4e98-8194-e57b87d30519',
            data: {
              created: '2023-10-25T10:44:39+00:00',
              updated: '2023-10-25T10:44:39+00:00',
              name: 'Red',
              color: '#BD002A',
            },
          },
        ],
        relations: [],
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }),
);

test('GetIndexEndpoint should handle collection response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const getIndexEndpoint = new GetIndexEndpoint(logger, fetchHelper, collectionParser);
  const parsedResponse = await getIndexEndpoint.getIndex();

  if (!('data' in parsedResponse)) {
    throw new Error('Expected parsed response to contain data attribute.');
  }

  const collection = parsedResponse.data;

  expect(collection).to.have.keys('id', 'links', 'totalNodes', 'nodes', 'relations');
  expect(Object.keys(collection.nodes)).to.have.lengthOf(2);
  expect(Object.keys(collection.relations)).to.have.lengthOf(0);

  const response = parsedResponse.response;
  expect(response.status).toEqual(200);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/?page=1&pageSize=25',
  );
  mockServer.close();
});
