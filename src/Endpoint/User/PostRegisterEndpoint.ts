import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';

import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { Data, UniqueUserIdentifier, Uuid } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The post register endpoint is used to create new user accounts.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/user?id=postregisterendpoint)
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

  postRegister(uniqueUserIdentifier: UniqueUserIdentifier, password: string, data: Data = {}): Promise<Uuid> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/register`);
        this.logger.debug(`Executing HTTP POST request against URL: ${url}`);
        return fetch(
          url,
          this.fetchHelper.getDefaultPostOptions(
            JSON.stringify({
              type: 'User',
              uniqueUserIdentifier: uniqueUserIdentifier,
              password: password,
              data: data,
            }),
          ),
        );
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseLocationResponse(response))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { PostRegisterEndpoint };
