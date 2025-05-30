import { FetchHelper, Logger, ServiceResolver } from '../../Service/index.js';
import { Data, Uuid } from '../../Type/Definition/index.js';
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
    private logger: Logger,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PutElementEndpoint {
    return new PutElementEndpoint(
      serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.fetchHelper),
    );
  }

  putElement(elementId: Uuid, data: Data): Promise<void> {
    return Promise.resolve()
      .then(() => {
        // @todo what exactly will change?
        this.logger.warn(
          'The endpoint put element will be changed in the next major version, expect changed interfaces.',
        );
        const url = this.fetchHelper.buildUrl(`/${elementId}`);
        this.logger.debug(`Executing HTTP PUT request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultPutOptions(JSON.stringify(data)));
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseEmptyResponse(response))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { PutElementEndpoint };
