import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';

import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { Data, Uuid } from '../../Type/Definition/index.js';
import { EmptyResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The put element endpoint replaces a single element.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/element?id=putelementendpoint)
 * @see [Ember Nexus API: Replace Element Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/put-element)
 */

class PutElementEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementPutElementEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PutElementEndpoint {
    return new PutElementEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  async putElement(elementId: Uuid, data: Data): Promise<EmptyResponse> {
    try {
      const url = this.fetchHelper.buildUrl(`/${elementId}`);
      this.logger.debug(`Executing HTTP PUT request against URL: ${url}`);

      const response = await fetch(url, this.fetchHelper.getDefaultPutOptions(JSON.stringify(data))).catch((error) =>
        this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      await this.fetchHelper.parseEmptyResponse(response);

      return {
        response: response,
      };
    } catch (error) {
      this.fetchHelper.logAndThrowError(error);
    }
  }
}

export { PutElementEndpoint };
