import { ApiConfiguration } from './ApiConfiguration.js';
import { Logger } from './Logger.js';
import { ServiceResolver } from './ServiceResolver.js';
import {
  EmberNexusError,
  NetworkError,
  ParseError,
  Response401UnauthorizedError,
  Response403ForbiddenError,
  Response404NotFoundError,
  Response429TooManyRequestsError,
  ResponseError,
} from '../Error/index.js';
import { Uuid, validateUuidFromString } from '../Type/Definition/index.js';
import { HttpRequestMethod, ServiceIdentifier } from '../Type/Enum/index.js';

/**
 * Collection of different fetch helper methods.
 */
class FetchHelper {
  static identifier: ServiceIdentifier = ServiceIdentifier.serviceFetchHelper;
  constructor(
    private logger: Logger,
    private apiConfiguration: ApiConfiguration,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): FetchHelper {
    const logger = serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger);
    const apiConfiguration = serviceResolver.getServiceOrFail<ApiConfiguration>(
      ServiceIdentifier.serviceApiConfiguration,
    );
    return new FetchHelper(logger, apiConfiguration);
  }

  rethrowErrorAsNetworkError(error: unknown): never {
    if (error instanceof EmberNexusError) {
      throw error;
    }
    throw new NetworkError('Network error occurred during fetch.', error);
  }

  logAndThrowError(error: unknown): never {
    const err = error instanceof Error ? error : new Error(String(error));
    this.logger.error(err.message, err);
    throw err;
  }

  parseJsonResponse(response: Response): Promise<object> {
    const contentType = response.headers.get('Content-Type');

    if (!contentType) {
      return Promise.reject(new ParseError('Response does not contain a Content-Type header.'));
    }

    if (!contentType.includes('application/json') && !contentType.includes('application/problem+json')) {
      throw new ParseError(`Unexpected Content-Type: "${contentType}". Expected JSON-compatible format.`);
    }

    return response
      .json()
      .catch((err) => {
        throw new ParseError(`Failed to parse response body as JSON: ${err}`);
      })
      .then((data) => {
        if (!response.ok) {
          throw this.createResponseErrorFromBadResponse(response, data);
        }
        return data as object;
      });
  }

  parseEmptyResponse(response: Response): Promise<void> {
    if (response.ok && response.status === 204) {
      return Promise.resolve();
    }
    const contentType = response.headers.get('Content-Type');
    if (contentType === null) {
      return Promise.reject(new ParseError('Response does not contain content type header.'));
    }
    if (!contentType.includes('application/problem+json')) {
      return Promise.reject(
        new ParseError("Unable to parse response as content type is not 'application/problem+json'."),
      );
    }

    return response
      .json()
      .catch((err) => {
        throw new ParseError(`Failed to parse response body as JSON: ${err}`);
      })
      .then((data) => {
        throw this.createResponseErrorFromBadResponse(response, data);
      });
  }

  parseLocationResponse(response: Response): Promise<Uuid> {
    if (response.ok && (response.status === 201 || response.status === 204)) {
      if (response.headers.has('Location')) {
        const location = response.headers.get('Location') as string;
        const rawUuid = location.split('/').at(-1) as string;
        return Promise.resolve(validateUuidFromString(rawUuid));
      }
    }
    const contentType = response.headers.get('Content-Type');
    if (contentType === null) {
      return Promise.reject(new ParseError('Response does not contain content type header.'));
    }
    if (!contentType.includes('application/problem+json')) {
      return Promise.reject(
        new ParseError("Unable to parse response as content type is not 'application/problem+json'."),
      );
    }

    return response
      .json()
      .catch((err) => {
        throw new ParseError(`Failed to parse response body as JSON: ${err}`);
      })
      .then((data) => {
        throw this.createResponseErrorFromBadResponse(response, data);
      });
  }

  createResponseErrorFromBadResponse(response: Response, data: Record<string, unknown>): ResponseError {
    let errorInstance: ResponseError | null = null;

    if (response.status === 401) {
      errorInstance = new Response401UnauthorizedError('Server returned 401 unauthorized.');
    }
    if (response.status === 403) {
      errorInstance = new Response403ForbiddenError('Server returned 403 forbidden.');
    }
    if (response.status === 404) {
      errorInstance = new Response404NotFoundError('Server returned 404 not found.');
    }
    if (response.status === 429) {
      errorInstance = new Response429TooManyRequestsError('Server returned 429 too many requests.');
    }

    if (errorInstance === null) errorInstance = new ResponseError('Generic response error.');

    if ('type' in data) {
      errorInstance.setType(String(data.type));
    }
    if ('title' in data) {
      errorInstance.setTitle(String(data.title));
    }
    if ('detail' in data) {
      errorInstance.setDetail(String(data.detail));
    }
    if ('status' in data && errorInstance.getStatus() === null) {
      errorInstance.setStatus(Number(data.status));
    }

    return errorInstance;
  }

  addAuthorizationHeader(headers: HeadersInit): void {
    if (this.apiConfiguration.hasToken()) {
      // eslint-disable-next-line dot-notation
      headers['Authorization'] = `Bearer ${this.apiConfiguration.getToken()}`;
    }
  }

  addAcceptJsonAndProblemJsonHeader(headers: HeadersInit): void {
    // eslint-disable-next-line dot-notation
    headers['Accept'] = 'application/json, application/problem+json';
  }

  addContentTypeJsonHeader(headers: HeadersInit): void {
    headers['Content-Type'] = 'application/json';
  }

  getDefaultGetOptions(): RequestInit {
    const headers = {};
    this.addAuthorizationHeader(headers);
    this.addAcceptJsonAndProblemJsonHeader(headers);
    return {
      method: HttpRequestMethod.GET,
      headers: headers,
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    };
  }

  getDefaultDeleteOptions(): RequestInit {
    const headers = {};
    this.addAuthorizationHeader(headers);
    this.addAcceptJsonAndProblemJsonHeader(headers);
    return {
      method: HttpRequestMethod.DELETE,
      headers: headers,
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    };
  }

  getDefaultPostOptions(body: string): RequestInit {
    const headers = {};
    this.addAuthorizationHeader(headers);
    this.addAcceptJsonAndProblemJsonHeader(headers);
    this.addContentTypeJsonHeader(headers);
    return {
      method: HttpRequestMethod.POST,
      headers: headers,
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: body,
    };
  }

  getDefaultPatchOptions(body: string): RequestInit {
    const headers = {};
    this.addAuthorizationHeader(headers);
    this.addAcceptJsonAndProblemJsonHeader(headers);
    this.addContentTypeJsonHeader(headers);
    return {
      method: HttpRequestMethod.PATCH,
      headers: headers,
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: body,
    };
  }

  getDefaultPutOptions(body: string): RequestInit {
    const headers = {};
    this.addAuthorizationHeader(headers);
    this.addAcceptJsonAndProblemJsonHeader(headers);
    this.addContentTypeJsonHeader(headers);
    return {
      method: HttpRequestMethod.PUT,
      headers: headers,
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: body,
    };
  }

  buildUrl(url: string): string {
    return `${this.apiConfiguration.getApiHost()}${url}`;
  }

  runWrappedFetch(url: string, init?: RequestInit | undefined): Promise<Response> {
    url = `${this.apiConfiguration.getApiHost()}${url}`;
    this.logger.debug(`Executing HTTP ${init?.method ?? '-'} request against url ${url} .`);
    return fetch(url, init);
  }
}

export { FetchHelper };
