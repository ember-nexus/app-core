import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';

import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { Data, Uuid } from '../../Type/Definition/index.js';
import { EmptyResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The patch element endpoint updates a single element.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/element?id=patchelementendpoint)
 * @see [Ember Nexus API: Update Element Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/patch-element)
 */
class PatchElementEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementPatchElementEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PatchElementEndpoint {
    return new PatchElementEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  async patchElement(elementId: Uuid, data: Data): Promise<EmptyResponse> {
    try {
      const url = this.fetchHelper.buildUrl(`/${elementId}`);
      this.logger.debug(`Executing HTTP PATCH request against URL: ${url}`);

      const response = await fetch(url, this.fetchHelper.getDefaultPatchOptions(JSON.stringify(data))).catch((error) =>
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

export { PatchElementEndpoint };
