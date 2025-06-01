import { FetchHelper, Logger, ServiceResolver } from '../../Service/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The delete token endpoint deletes the currently used token.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/user?id=deletetokenendpoint)
 * @see [Ember Nexus API: Delete Token Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/user/delete-token)
 */
class DeleteTokenEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointUserDeleteTokenEndpoint;
  constructor(
    private logger: Logger,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): DeleteTokenEndpoint {
    return new DeleteTokenEndpoint(
      serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  deleteToken(): Promise<void> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/token`);
        this.logger.debug(`Executing HTTP DELETE request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultDeleteOptions());
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseEmptyResponse(response))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { DeleteTokenEndpoint };
