import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetMeEndpoint } from '../../../../../src/Endpoint/User';
import { ElementParser, FetchHelper } from '../../../../../src/Service';
import { LoggerInterface } from '../../../../../src/Type/Definition';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/me', () => {
    return HttpResponse.json(
      {
        type: 'User',
        id: '2d376349-c5e2-42c8-8ce0-d6f525256cf7',
        data: {
          created: '2023-10-06T10:07:35+00:00',
          updated: '2023-10-06T10:07:35+00:00',
          name: 'User',
          email: 'anonymous-user@localhost.dev',
          note: 'User contains password only due to testing purposes.',
          password: '1234',
          scenario: 'general.anonymousUser',
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

test('GetMeEndpoint should handle node response', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');

  const getElementEndpoint = new GetMeEndpoint(logger, fetchHelper, elementParser);
  const parsedResponse = await getElementEndpoint.getMe();

  const node = parsedResponse.data;
  expect(node).to.have.keys('id', 'type', 'data');
  expect(node).to.not.have.keys('start', 'end');
  expect(node.type).toEqual('User');
  expect(node.data.created).to.be.instanceof(Date);
  expect(node.data.updated).to.be.instanceof(Date);
  expect(Object.keys(node.data)).to.have.lengthOf(7);

  const response = parsedResponse.response;
  expect(response.status).toEqual(200);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith('Executing HTTP GET request against URL: http://mock-api/me');
  mockServer.close();
});
