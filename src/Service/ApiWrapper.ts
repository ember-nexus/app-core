import {
  ElementCache,
  ElementChildrenCache,
  ElementParentsCache,
  ElementRelatedCache,
  IndexCache,
} from '../Cache/index.js';
import {
  GetElementChildrenEndpoint,
  GetElementEndpoint,
  GetElementParentsEndpoint,
  GetElementRelatedEndpoint,
  GetIndexEndpoint,
} from '../Endpoint/Element/index.js';
import { ServiceResolver } from '../Service/index.js';
import { Collection, Node, Relation, Uuid } from '../Type/Definition/index.js';
import { ParsedResponse } from '../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

class ApiWrapper {
  static identifier: ServiceIdentifier = ServiceIdentifier.serviceApiWrapper;

  constructor(
    private getElementEndpoint: GetElementEndpoint,
    private getElementChildrenEndpoint: GetElementChildrenEndpoint,
    private getElementParentsEndpoint: GetElementParentsEndpoint,
    private getElementRelatedEndpoint: GetElementRelatedEndpoint,
    private getIndexEndpoint: GetIndexEndpoint,
    private elementCache: ElementCache,
    private elementChildrenCache: ElementChildrenCache,
    private elementParentsCache: ElementParentsCache,
    private elementRelatedCache: ElementRelatedCache,
    private indexCache: IndexCache,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): ApiWrapper {
    return new ApiWrapper(
      serviceResolver.getServiceOrFail<GetElementEndpoint>(ServiceIdentifier.endpointElementGetElementEndpoint),
      serviceResolver.getServiceOrFail<GetElementChildrenEndpoint>(
        ServiceIdentifier.endpointElementGetElementChildrenEndpoint,
      ),
      serviceResolver.getServiceOrFail<GetElementParentsEndpoint>(
        ServiceIdentifier.endpointElementGetElementParentsEndpoint,
      ),
      serviceResolver.getServiceOrFail<GetElementRelatedEndpoint>(
        ServiceIdentifier.endpointElementGetElementRelatedEndpoint,
      ),
      serviceResolver.getServiceOrFail<GetIndexEndpoint>(ServiceIdentifier.endpointElementGetIndexEndpoint),
      serviceResolver.getServiceOrFail<ElementCache>(ServiceIdentifier.cacheElement),
      serviceResolver.getServiceOrFail<ElementChildrenCache>(ServiceIdentifier.cacheElementChildren),
      serviceResolver.getServiceOrFail<ElementParentsCache>(ServiceIdentifier.cacheElementParents),
      serviceResolver.getServiceOrFail<ElementRelatedCache>(ServiceIdentifier.cacheElementRelated),
      serviceResolver.getServiceOrFail<IndexCache>(ServiceIdentifier.cacheIndex),
    );
  }

  public async getElement(
    elementId: Uuid,
    {
      forceLoad = false,
    }: {
      forceLoad?: boolean;
    } = {},
  ): Promise<Node | Relation> {
    const cacheKey = ElementCache.createCacheKey(elementId);
    const cacheEntry = this.elementCache.get(cacheKey);

    if (cacheEntry && !forceLoad) {
      return cacheEntry.data;
    }

    if (cacheEntry) {
      const response = await this.getElementEndpoint.getElement(elementId, cacheEntry.etag);
      if ('data' in response) {
        this.elementCache.setFromParsedResponse(cacheKey, response);
        return response.data;
      }
      this.elementCache.refresh(cacheKey);
      return cacheEntry.data;
    }

    const parsedResponse = (await this.getElementEndpoint.getElement(elementId)) as ParsedResponse<Node | Relation>;
    this.elementCache.setFromParsedResponse(cacheKey, parsedResponse);
    return parsedResponse.data;
  }

  public async getElementChildren(
    parentId: Uuid,
    {
      page = 1,
      pageSize = 25,
      forceLoad = false,
    }: {
      page?: number;
      pageSize?: number;
      forceLoad?: boolean;
    } = {},
  ): Promise<Collection> {
    const cacheKey = ElementChildrenCache.createCacheKey(parentId, page, pageSize);
    const cacheEntry = this.elementChildrenCache.get(cacheKey);

    if (cacheEntry && !forceLoad) {
      return cacheEntry.data;
    }

    if (cacheEntry) {
      const response = await this.getElementChildrenEndpoint.getElementChildren(
        parentId,
        page,
        pageSize,
        cacheEntry.etag,
      );
      if ('data' in response) {
        this.elementChildrenCache.setFromParsedResponse(cacheKey, response);
        this.elementCache.setFromCollection(response.data);
        return response.data;
      }
      this.elementChildrenCache.refresh(cacheKey);
      return cacheEntry.data;
    }

    const parsedResponse = (await this.getElementChildrenEndpoint.getElementChildren(
      parentId,
      page,
      pageSize,
    )) as ParsedResponse<Collection>;
    this.elementChildrenCache.setFromParsedResponse(cacheKey, parsedResponse);
    this.elementCache.setFromCollection(parsedResponse.data);
    return parsedResponse.data;
  }

  public async getElementParents(
    childId: Uuid,
    {
      page = 1,
      pageSize = 25,
      forceLoad = false,
    }: {
      page?: number;
      pageSize?: number;
      forceLoad?: boolean;
    } = {},
  ): Promise<Collection> {
    const cacheKey = ElementParentsCache.createCacheKey(childId, page, pageSize);
    const cacheEntry = this.elementParentsCache.get(cacheKey);

    if (cacheEntry && !forceLoad) {
      return cacheEntry.data;
    }

    if (cacheEntry) {
      const response = await this.getElementParentsEndpoint.getElementParents(childId, page, pageSize, cacheEntry.etag);
      if ('data' in response) {
        this.elementParentsCache.setFromParsedResponse(cacheKey, response);
        this.elementCache.setFromCollection(response.data);
        return response.data;
      }
      this.elementParentsCache.refresh(cacheKey);
      return cacheEntry.data;
    }

    const parsedResponse = (await this.getElementParentsEndpoint.getElementParents(
      childId,
      page,
      pageSize,
    )) as ParsedResponse<Collection>;
    this.elementParentsCache.setFromParsedResponse(cacheKey, parsedResponse);
    this.elementCache.setFromCollection(parsedResponse.data);
    return parsedResponse.data;
  }

  public async getElementRelated(
    centerId: Uuid,
    {
      page = 1,
      pageSize = 25,
      forceLoad = false,
    }: {
      page?: number;
      pageSize?: number;
      forceLoad?: boolean;
    } = {},
  ): Promise<Collection> {
    const cacheKey = ElementRelatedCache.createCacheKey(centerId, page, pageSize);
    const cacheEntry = this.elementRelatedCache.get(cacheKey);

    if (cacheEntry && !forceLoad) {
      return cacheEntry.data;
    }

    if (cacheEntry) {
      const response = await this.getElementRelatedEndpoint.getElementRelated(
        centerId,
        page,
        pageSize,
        cacheEntry.etag,
      );
      if ('data' in response) {
        this.elementRelatedCache.setFromParsedResponse(cacheKey, response);
        this.elementCache.setFromCollection(response.data);
        return response.data;
      }
      this.elementRelatedCache.refresh(cacheKey);
      return cacheEntry.data;
    }

    const parsedResponse = (await this.getElementRelatedEndpoint.getElementRelated(
      centerId,
      page,
      pageSize,
    )) as ParsedResponse<Collection>;
    this.elementRelatedCache.setFromParsedResponse(cacheKey, parsedResponse);
    this.elementCache.setFromCollection(parsedResponse.data);
    return parsedResponse.data;
  }

  public async getIndex({
    page = 1,
    pageSize = 25,
    forceLoad = false,
  }: {
    page?: number;
    pageSize?: number;
    forceLoad?: boolean;
  } = {}): Promise<Collection> {
    const cacheKey = IndexCache.createCacheKey(page, pageSize);
    const cacheEntry = this.indexCache.get(cacheKey);

    if (cacheEntry && !forceLoad) {
      return cacheEntry.data;
    }

    if (cacheEntry) {
      const response = await this.getIndexEndpoint.getIndex(page, pageSize, cacheEntry.etag);
      if ('data' in response) {
        this.indexCache.setFromParsedResponse(cacheKey, response);
        this.elementCache.setFromCollection(response.data);
        return response.data;
      }
      this.indexCache.refresh(cacheKey);
      return cacheEntry.data;
    }

    const parsedResponse = (await this.getIndexEndpoint.getIndex(page, pageSize)) as ParsedResponse<Collection>;
    this.indexCache.setFromParsedResponse(cacheKey, parsedResponse);
    this.elementCache.setFromCollection(parsedResponse.data);
    return parsedResponse.data;
  }
}

export { ApiWrapper };
