import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { Data, LoggerInterface, UniqueUserIdentifier, Uuid } from '../../Type/Definition/index.js';
import { ParsedResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The post register endpoint is used to create new user accounts.
 *
 * @see [Ember Nexus API: Register New Account Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/user/post-register)
 */
class PostRegisterEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointUserPostRegisterEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PostRegisterEndpoint {
    return new PostRegisterEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  async postRegister(
    uniqueUserIdentifier: UniqueUserIdentifier,
    password: string,
    data: Data = {},
  ): Promise<ParsedResponse<Uuid>> {
    try {
      const url = this.fetchHelper.buildUrl(`/register`);
      this.logger.debug(`Executing HTTP POST request against URL: ${url}`);

      const payload = {
        type: 'User',
        uniqueUserIdentifier: uniqueUserIdentifier,
        password: password,
        data: data,
      };

      const response = await fetch(url, this.fetchHelper.getDefaultPostOptions(JSON.stringify(payload))).catch(
        (error) => this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      const uuid = await this.fetchHelper.parseLocationResponse(response);

      return {
        data: uuid,
        response: response,
      };
    } catch (error) {
      this.fetchHelper.logAndThrowError(error);
    }
  }
}

export { PostRegisterEndpoint };
