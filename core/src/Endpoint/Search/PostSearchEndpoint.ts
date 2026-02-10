import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import { LoggerInterface } from '../../Type/Definition/index.js';
import { ParsedResponse } from '../../Type/Definition/Response/index.js';
import { Step } from '../../Type/Definition/Search/Step/index.js';
import { StepResult } from '../../Type/Definition/Search/StepResult/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The post search endpoint executes a search query and returns results.
 *
 * @see [Ember Nexus API: Search Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/search/post-search)
 * @experimental
 */
class PostSearchEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointSearchPostSearchEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PostSearchEndpoint {
    return new PostSearchEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  async postSearch(
    steps: Step[],
    parameters: null | Record<string, unknown> = null,
    debug: boolean = false,
  ): Promise<ParsedResponse<StepResult[]>> {
    try {
      const url = this.fetchHelper.buildUrl('/search');
      this.logger.debug(`Executing HTTP POST request against URL: ${url}`);

      const payload: Record<string, unknown> = {
        steps,
      };
      if (parameters !== null) {
        payload.parameters = parameters;
      }
      if (debug) {
        payload.debug = true;
      }

      const response = await fetch(url, this.fetchHelper.getDefaultPostOptions(JSON.stringify(payload))).catch(
        (error) => this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      const rawData = await this.fetchHelper.parseJsonResponse(response);

      if (!('results' in rawData)) {
        throw new Error("Search result did not contain property 'results'.");
      }

      return {
        data: rawData.results as StepResult[],
        response: response,
      };
    } catch (error) {
      this.fetchHelper.logAndThrowError(error);
    }
  }
}

export { PostSearchEndpoint };
