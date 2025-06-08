import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';

import { FetchHelper, ServiceResolver, TokenParser } from '../../Service/index.js';
import { Data, Token, UniqueUserIdentifier } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The post token endpoint is used to create new tokens.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/user?id=posttokenendpoint)
 * @see [Ember Nexus API: Create Token Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/user/post-token)
 */
class PostTokenEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointUserPostTokenEndpoint;
  constructor(
    private logger: LoggerInterface,
    private tokenParser: TokenParser,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PostTokenEndpoint {
    return new PostTokenEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<TokenParser>(ServiceIdentifier.serviceTokenParser),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  postToken(uniqueUserIdentifier: UniqueUserIdentifier, password: string, data: Data = {}): Promise<Token> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/token`);
        this.logger.debug(`Executing HTTP POST request against URL: ${url}`);
        return fetch(
          url,
          this.fetchHelper.getDefaultPostOptions(
            JSON.stringify({
              type: 'Token',
              uniqueUserIdentifier: uniqueUserIdentifier,
              password: password,
              data: data,
            }),
          ),
        );
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseJsonResponse(response))
      .then((rawToken) => this.tokenParser.rawTokenToToken(rawToken))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { PostTokenEndpoint };
