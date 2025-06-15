import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';

import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { EmptyResponse } from '../../Type/Definition/Response/index.js';
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
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): DeleteTokenEndpoint {
    return new DeleteTokenEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  async deleteToken(): Promise<EmptyResponse> {
    try {
      const url = this.fetchHelper.buildUrl(`/token`);
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

export { DeleteTokenEndpoint };
