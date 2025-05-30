import { NetworkError, ParseError } from '../../Error/index.js';
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
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.fetchHelper),
    );
  }

  deleteToken(): Promise<void> {
    const url = this.fetchHelper.buildUrl(`/token`);
    this.logger.debug(`Executing HTTP DELETE request against url ${url} .`);
    return fetch(url, this.fetchHelper.getDefaultDeleteOptions())
      .catch((networkError) => {
        throw new NetworkError(`Experienced generic network error during deleting resource.`, networkError);
      })
      .then(async (response: Response) => {
        if (response.ok && response.status === 204) {
          return;
        }
        const contentType = response.headers.get('Content-Type');
        if (contentType === null) {
          throw new ParseError('Response does not contain content type header.');
        }
        if (!contentType.includes('application/problem+json')) {
          throw new ParseError("Unable to parse response as content type is not 'application/problem+json'.");
        }
        const data = await response.json();
        throw this.fetchHelper.createResponseErrorFromBadResponse(response, data);
      })
      .catch((error) => {
        this.logger.error(error.message, error);
        throw error;
      });
  }
}

export { DeleteTokenEndpoint };
