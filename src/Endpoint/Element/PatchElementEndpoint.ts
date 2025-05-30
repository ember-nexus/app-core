import { FetchHelper, Logger, ServiceResolver } from '../../Service/index.js';
import { Data, Uuid } from '../../Type/Definition/index.js';
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
    private logger: Logger,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PatchElementEndpoint {
    return new PatchElementEndpoint(
      serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.fetchHelper),
    );
  }

  patchElement(elementId: Uuid, data: Data): Promise<void> {
    return Promise.resolve()
      .then(() => {
        // @todo what exactly will change?
        this.logger.warn(
          'The endpoint patch element will be changed in the next major version, expect changed interfaces.',
        );
        const url = this.fetchHelper.buildUrl(`/${elementId}`);
        this.logger.debug(`Executing HTTP PATCH request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultPatchOptions(JSON.stringify(data)));
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseEmptyResponse(response))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { PatchElementEndpoint };
