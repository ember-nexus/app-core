import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { LoggerInterface, NodeWithOptionalId, RelationWithOptionalId, Uuid } from '../../Type/Definition/index.js';
import { ParsedResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The post index endpoint creates a single element.
 *
 * @see [Ember Nexus API: Create Root Level Element Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/post-index)
 */
class PostIndexEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementPostIndexEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PostIndexEndpoint {
    return new PostIndexEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  async postIndex(element: NodeWithOptionalId | RelationWithOptionalId): Promise<ParsedResponse<Uuid>> {
    try {
      const url = this.fetchHelper.buildUrl(`/`);
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

export { PostIndexEndpoint };
