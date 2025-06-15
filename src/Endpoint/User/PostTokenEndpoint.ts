import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';

import { FetchHelper, ServiceResolver, TokenParser } from '../../Service/index.js';
import { Data, Token, UniqueUserIdentifier } from '../../Type/Definition/index.js';
import { ParsedResponse } from '../../Type/Definition/Response/index.js';
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

  async postToken(
    uniqueUserIdentifier: UniqueUserIdentifier,
    password: string,
    data: Data = {},
  ): Promise<ParsedResponse<Token>> {
    try {
      const url = this.fetchHelper.buildUrl(`/token`);
      this.logger.debug(`Executing HTTP POST request against URL: ${url}`);

      const payload = {
        type: 'Token',
        uniqueUserIdentifier: uniqueUserIdentifier,
        password: password,
        data: data,
      };

      const response = await fetch(url, this.fetchHelper.getDefaultPostOptions(JSON.stringify(payload))).catch(
        (error) => this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      const rawData = await this.fetchHelper.parseJsonResponse(response);
      const token = this.tokenParser.rawTokenToToken(rawData);

      return {
        data: token,
        response: response,
      };
    } catch (error) {
      this.fetchHelper.logAndThrowError(error);
    }
  }
}

export { PostTokenEndpoint };
