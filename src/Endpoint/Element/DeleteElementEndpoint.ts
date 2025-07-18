import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { LoggerInterface, Uuid } from '../../Type/Definition/index.js';
import { EmptyResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The delete element endpoint deletes a single element.
 *
 * @see [Ember Nexus API: Delete Element Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/delete-element)
 */
class DeleteElementEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementDeleteElementEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): DeleteElementEndpoint {
    return new DeleteElementEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  async deleteElement(elementId: Uuid): Promise<EmptyResponse> {
    try {
      const url = this.fetchHelper.buildUrl(`/${elementId}`);
      this.logger.debug(`Executing HTTP DELETE request against URL: ${url}`);

      const response = await fetch(url, this.fetchHelper.getDefaultDeleteOptions()).catch((error) =>
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

export { DeleteElementEndpoint };
