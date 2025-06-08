import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { expect, test, vi } from 'vitest';

import { GetElementEndpoint } from '../../../../../src/Endpoint/Element';
import { ParseError } from '../../../../../src/Error';
import { ElementParser, FetchHelper } from '../../../../../src/Service';
import { ServiceIdentifier } from '../../../../../src/Type/Enum';
import { buildEndpointServiceResolver } from '../../EndpointHelper';

const mockServer = setupServer(
  http.get('http://mock-api/d00d3faf-5dc9-43f1-9efc-f78c2d7efa77', () => {
    const response = HttpResponse.text('Some content which can not be interpreted as JSON.', {
      status: 200,
    });
    response.headers.delete('Content-Type');
    return response;
  }),
);

test('GetElementEndpoint should handle no content type response error', async () => {
  mockServer.listen();
  const serviceResolver = buildEndpointServiceResolver();
  const fetchHelper = serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper);
  const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
  const logger = serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger);
  const debugLoggerSpy = vi.spyOn(logger, 'debug');
  const errorLoggerSpy = vi.spyOn(logger, 'error');

  const getElementEndpoint = new GetElementEndpoint(logger, fetchHelper, elementParser);
  await expect(getElementEndpoint.getElement('d00d3faf-5dc9-43f1-9efc-f78c2d7efa77')).rejects.toThrow(ParseError);

  expect(debugLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Executing HTTP GET request against URL: http://mock-api/d00d3faf-5dc9-43f1-9efc-f78c2d7efa77',
  );
  expect(errorLoggerSpy).toHaveBeenCalledExactlyOnceWith(
    'Response does not contain a Content-Type header.',
    expect.anything(),
  );
  mockServer.close();
});
