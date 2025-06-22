import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementEndpoint } from '../../../../../src/Endpoint/Element';
import { ElementParser, FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/b1e85bf9-6a79-4e50-ae5a-ed49beac8cb5', () => {
    return HttpResponse.json(
      {
        type: 'Data',
        id: 'b1e85bf9-6a79-4e50-ae5a-ed49beac8cb5',
        data: {
          created: '2023-10-06T20:27:56+00:00',
          updated: '2023-10-06T20:27:56+00:00',
          name: 'Test Data',
        },
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

test('GetElementEndpoint should handle node response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const getElementEndpoint = new GetElementEndpoint(logger, fetchHelper, elementParser);
  const parsedResponse = await getElementEndpoint.getElement('b1e85bf9-6a79-4e50-ae5a-ed49beac8cb5');

  if (!('data' in parsedResponse)) {
    throw new Error('Expected parsed response to contain data attribute.');
  }

  const node = parsedResponse.data;

  expect(node).to.have.keys('id', 'type', 'data');
  expect(node).to.not.have.keys('start', 'end');
  expect(node.id).toEqual('b1e85bf9-6a79-4e50-ae5a-ed49beac8cb5');
  expect(node.type).toEqual('Data');
  expect(node.data.created).to.be.instanceof(Date);
  expect(node.data.updated).to.be.instanceof(Date);
  expect(Object.keys(node.data)).to.have.lengthOf(3);

  const response = parsedResponse.response;
  expect(response.status).toEqual(200);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/b1e85bf9-6a79-4e50-ae5a-ed49beac8cb5',
  );
  mockServer.close();
});
