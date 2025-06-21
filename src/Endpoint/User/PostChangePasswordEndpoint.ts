import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';

import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { UniqueUserIdentifier } from '../../Type/Definition/index.js';
import { EmptyResponse } from '../../Type/Definition/Response/index.js';
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

  async postChangePassword(
    uniqueUserIdentifier: UniqueUserIdentifier,
    currentPassword: string,
    newPassword: string,
  ): Promise<EmptyResponse> {
    try {
      const url = this.fetchHelper.buildUrl(`/change-password`);
      this.logger.debug(`Executing HTTP POST request against URL: ${url}`);

      const payload = {
        type: 'ActionChangePassword',
        currentPassword: currentPassword,
        newPassword: newPassword,
        uniqueUserIdentifier: uniqueUserIdentifier,
      };

      const response = await fetch(url, this.fetchHelper.getDefaultPostOptions(JSON.stringify(payload))).catch(
        (error) => this.fetchHelper.rethrowErrorAsNetworkError(error),
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

export { PostChangePasswordEndpoint };
