import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';

import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { UniqueUserIdentifier } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The post change password endpoint is used to change the user's password.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/user?id=postchangepasswordendpoint)
 * @see [Ember Nexus API: Change Password Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/user/post-change-password)
 */
class PostChangePasswordEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointUserPostChangePasswordEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PostChangePasswordEndpoint {
    return new PostChangePasswordEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  postChangePassword(
    uniqueUserIdentifier: UniqueUserIdentifier,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/change-password`);
        this.logger.debug(`Executing HTTP POST request against URL: ${url}`);
        return fetch(
          url,
          this.fetchHelper.getDefaultPostOptions(
            JSON.stringify({
              type: 'ActionChangePassword',
              currentPassword: currentPassword,
              newPassword: newPassword,
              uniqueUserIdentifier: uniqueUserIdentifier,
            }),
          ),
        );
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseEmptyResponse(response))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { PostChangePasswordEndpoint };
