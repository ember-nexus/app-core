import { FetchHelper, ServiceResolver } from '../../Service/index.js';
import {LoggerInterface, SearchStep} from '../../Type/Definition/index.js';
import { ParsedResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';
import {ParseError} from "../../Error";

/**
 * The post search endpoint executes search steps / queries against the API and parses returned data.
 *
 * @see [Ember Nexus API: Search Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/search/post-search)
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

  async postSearch(searchSteps: SearchStep[], parameters: Record<string, unknown> = {}, isDebug: boolean = false): Promise<ParsedResponse<unknown[]>> {
    try {
      const url = this.fetchHelper.buildUrl(`/search`);
      this.logger.debug(`Executing HTTP POST request against URL: ${url}`);

      const requestBody = {
        debug: isDebug,
        steps: searchSteps,
        parameters: parameters
      };
      const response = await fetch(url, this.fetchHelper.getDefaultPostOptions(JSON.stringify(requestBody))).catch(
        (error) => this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      const data = await this.fetchHelper.parseJsonResponse(response);
      if (!('results' in data)) {
        return Promise.reject(new ParseError("Response does not contain property 'results'."));
      }
      const searchResults = data.results;
      if (!Array.isArray(searchResults)) {
        return Promise.reject(new ParseError(`Response property 'results' should have been of type array, not ${typeof searchResults}.`));
      }

      return {
        data: searchResults,
        response: response,
      };
    } catch (error) {
      this.fetchHelper.logAndThrowError(error);
    }
  }
}

export { PostSearchEndpoint };
