import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementChildrenEndpoint } from '../../../../../src/Endpoint/Element/index.js';
import { CollectionParser, FetchHelper } from '../../../../../src/Service/index.js';
import { LoggerInterface } from '../../../../../src/Type/Definition/index.js';
import { ServiceIdentifier } from '../../../../../src/Type/Enum/index.js';
import { buildEndpointServiceResolver } from '../../EndpointHelper.js';

const mockServer = setupServer(
  http.get('http://mock-api/07212e8a-14cc-4f45-a3e9-1179080bbd61/children', () => {
    return HttpResponse.json(
      {
        type: '_PartialCollection',
        id: '/07212e8a-14cc-4f45-a3e9-1179080bbd61/children',
        totalNodes: 2,
        links: {
          first: '/07212e8a-14cc-4f45-a3e9-1179080bbd61/children',
          previous: null,
          next: null,
          last: '/07212e8a-14cc-4f45-a3e9-1179080bbd61/children',
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
        relations: [
          {
            type: 'OWNS',
            id: 'bc1ba1ad-5866-4c23-a58e-15282994c72c',
            start: '07212e8a-14cc-4f45-a3e9-1179080bbd61',
            end: '45482998-274a-43d0-a466-f31d0b24cc0a',
            data: {
              created: '2023-10-25T10:44:42+00:00',
              updated: '2023-10-25T10:44:42+00:00',
            },
          },
          {
            type: 'OWNS',
            id: '94ab04d8-c7a0-408c-aea7-59c66018b242',
            start: '07212e8a-14cc-4f45-a3e9-1179080bbd61',
            end: '6b8341ca-851a-4e98-8194-e57b87d30519',
            data: {
              created: '2023-10-25T10:44:42+00:00',
              updated: '2023-10-25T10:44:42+00:00',
            },
          },
        ],
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

test('GetElementChildrenEndpoint should handle collection response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const collectionParser = serviceResolver.getServiceOrFail<CollectionParser>(
    ServiceIdentifier.serviceCollectionParser,
  );
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const getElementChildrenEndpoint = new GetElementChildrenEndpoint(logger, fetchHelper, collectionParser);
  const parsedResponse = await getElementChildrenEndpoint.getElementChildren('07212e8a-14cc-4f45-a3e9-1179080bbd61');

  if (!('data' in parsedResponse)) {
    throw new Error('Expected parsed response to contain data attribute.');
  }

  const collection = parsedResponse.data;

  expect(collection).to.have.keys('id', 'links', 'totalNodes', 'nodes', 'relations');
  expect(Object.keys(collection.nodes)).to.have.lengthOf(2);
  expect(Object.keys(collection.relations)).to.have.lengthOf(2);

  const response = parsedResponse.response;
  expect(response.status).toEqual(200);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/07212e8a-14cc-4f45-a3e9-1179080bbd61/children?page=1&pageSize=25',
  );
  mockServer.close();
});
