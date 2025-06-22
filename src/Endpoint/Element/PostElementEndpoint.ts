import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { LoggerInterface, NodeWithOptionalId, Uuid } from '../../Type/Definition/index.js';
import { ParsedResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The post element endpoint creates a single child node.
 *
 * @see [Ember Nexus API: Create Element Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/post-element)
 */
class PostElementEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementPostElementEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PostElementEndpoint {
    return new PostElementEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  async postElement(parentId: Uuid, element: NodeWithOptionalId): Promise<ParsedResponse<Uuid>> {
    try {
      const url = this.fetchHelper.buildUrl(`/${parentId}`);
      this.logger.debug(`Executing HTTP POST request against URL: ${url}`);

      const response = await fetch(url, this.fetchHelper.getDefaultPostOptions(JSON.stringify(element))).catch(
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

export { PostElementEndpoint };
