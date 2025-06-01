import { FetchHelper, Logger, ServiceResolver } from '../../Service/index.js';
import { Uuid } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The delete element endpoint deletes a single element.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/element?id=deleteelementendpoint)
 * @see [Ember Nexus API: Delete Element Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/delete-element)
 */
class DeleteElementEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementDeleteElementEndpoint;
  constructor(
    private logger: Logger,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): DeleteElementEndpoint {
    return new DeleteElementEndpoint(
      serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  deleteElement(elementId: Uuid): Promise<void> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/${elementId}`);
        this.logger.debug(`Executing HTTP DELETE request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultDeleteOptions());
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseEmptyResponse(response))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { DeleteElementEndpoint };
