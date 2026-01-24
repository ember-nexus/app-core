import {
  ElementCache,
  ElementChildrenCache,
  ElementParentsCache,
  ElementRelatedCache,
  IndexCache,
} from '../Cache/index.js';
import {
  DeleteElementEndpoint,
  GetElementChildrenEndpoint,
  GetElementEndpoint,
  GetElementParentsEndpoint,
  GetElementRelatedEndpoint,
  GetIndexEndpoint,
  PatchElementEndpoint,
  PostElementEndpoint,
  PostIndexEndpoint,
  PutElementEndpoint,
} from '../Endpoint/Element/index.js';
import {
  DeleteTokenEndpoint,
  GetMeEndpoint,
  GetTokenEndpoint,
  PostChangePasswordEndpoint,
  PostRegisterEndpoint,
  PostTokenEndpoint,
} from '../Endpoint/User/index.js';
import { ServiceResolver } from '../Service/index.js';
import {
  Collection,
  Data,
  Node,
  NodeWithOptionalId,
  Relation,
  RelationWithOptionalId,
  Token,
  UniqueUserIdentifier,
  Uuid,
} from '../Type/Definition/index.js';
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
    private postIndexEndpoint: PostIndexEndpoint,
    private postElementEndpoint: PostElementEndpoint,
    private putElementEndpoint: PutElementEndpoint,
    private patchElementEndpoint: PatchElementEndpoint,
    private deleteElementEndpoint: DeleteElementEndpoint,
    private postRegisterEndpoint: PostRegisterEndpoint,
    private postChangePasswordEndpoint: PostChangePasswordEndpoint,
    private getMeEndpoint: GetMeEndpoint,
    private postTokenEndpoint: PostTokenEndpoint,
    private getTokenEndpoint: GetTokenEndpoint,
    private deleteTokenEndpoint: DeleteTokenEndpoint,
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
      serviceResolver.getServiceOrFail<PostIndexEndpoint>(ServiceIdentifier.endpointElementPostIndexEndpoint),
      serviceResolver.getServiceOrFail<PostElementEndpoint>(ServiceIdentifier.endpointElementPostElementEndpoint),
      serviceResolver.getServiceOrFail<PutElementEndpoint>(ServiceIdentifier.endpointElementPutElementEndpoint),
      serviceResolver.getServiceOrFail<PatchElementEndpoint>(ServiceIdentifier.endpointElementPatchElementEndpoint),
      serviceResolver.getServiceOrFail<DeleteElementEndpoint>(ServiceIdentifier.endpointElementDeleteElementEndpoint),
      serviceResolver.getServiceOrFail<PostRegisterEndpoint>(ServiceIdentifier.endpointUserPostRegisterEndpoint),
      serviceResolver.getServiceOrFail<PostChangePasswordEndpoint>(
        ServiceIdentifier.endpointUserPostChangePasswordEndpoint,
      ),
      serviceResolver.getServiceOrFail<GetMeEndpoint>(ServiceIdentifier.endpointUserGetMeEndpoint),
      serviceResolver.getServiceOrFail<PostTokenEndpoint>(ServiceIdentifier.endpointUserPostTokenEndpoint),
      serviceResolver.getServiceOrFail<GetTokenEndpoint>(ServiceIdentifier.endpointUserGetTokenEndpoint),
      serviceResolver.getServiceOrFail<DeleteTokenEndpoint>(ServiceIdentifier.endpointUserDeleteTokenEndpoint),
      serviceResolver.getServiceOrFail<ElementCache>(ServiceIdentifier.cacheElement),
      serviceResolver.getServiceOrFail<ElementChildrenCache>(ServiceIdentifier.cacheElementChildren),
      serviceResolver.getServiceOrFail<ElementParentsCache>(ServiceIdentifier.cacheElementParents),
      serviceResolver.getServiceOrFail<ElementRelatedCache>(ServiceIdentifier.cacheElementRelated),
      serviceResolver.getServiceOrFail<IndexCache>(ServiceIdentifier.cacheIndex),
    );
  }

  /**
   * Returns a node or relation by its identifier.
   *
   * If cached, the element is returned immediately. Otherwise, it is fetched via the API.
   * The element cache is always kept in sync with the latest local state.
   *
   * Set the `forceLoad` flag to `true` to force an API request, bypassing the cache.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * const element = await apiWrapper.getElement('56cca4fa-b270-45ca-8209-845368e7fc07');
   * ```
   *
   * @see [Ember Nexus API: Get element endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/get-element)
   */
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

  /**
   * Returns all children of a parent node and all relations between the parent node and them by specifying the parent
   * identifier. Data is returned as a paginated collection object.
   *
   * If cached, the collection is returned immediately. Otherwise, it is fetched via the API.
   * The collection cache might contain outdated local state.
   *
   * Set the `forceLoad` flag to `true` to force an API request, bypassing the cache.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * const collection = await apiWrapper.getElementChildren('56cca4fa-b270-45ca-8209-845368e7fc07');
   * ```
   *
   * @see [Ember Nexus API: Get element children endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/get-children)
   */
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

  /**
   * Returns all parents of a child node and all relations between the child node and them by specifying the child
   * identifier. Data is returned as a paginated collection object.
   *
   * If cached, the collection is returned immediately. Otherwise, it is fetched via the API.
   * The collection cache might contain outdated local state.
   *
   * Set the `forceLoad` flag to `true` to force an API request, bypassing the cache.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * const collection = await apiWrapper.getElementParents('56cca4fa-b270-45ca-8209-845368e7fc07');
   * ```
   *
   * @see [Ember Nexus API: Get element parents endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/get-parents)
   */
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

  /**
   * Returns all related nodes of a central node and all relations between the central node and them by specifying the
   * central identifier. Data is returned as a paginated collection object.
   *
   * If cached, the collection is returned immediately. Otherwise, it is fetched via the API.
   * The collection cache might contain outdated local state.
   *
   * Set the `forceLoad` flag to `true` to force an API request, bypassing the cache.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * const collection = await apiWrapper.getElementRelated('56cca4fa-b270-45ca-8209-845368e7fc07');
   * ```
   *
   * @see [Ember Nexus API: Get element related endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/get-related)
   */
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

  /**
   * Returns all nodes on the root level.
   * As this collection only returns nodes, no relations will be returned. Data is returned as a paginated collection
   * object.
   *
   * If cached, the collection is returned immediately. Otherwise, it is fetched via the API.
   * The collection cache might contain outdated local state.
   *
   * Set the `forceLoad` flag to `true` to force an API request, bypassing the cache.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * const collection = await apiWrapper.getIndex();
   * ```
   *
   * @see [Ember Nexus API: Get index endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/get-index)
   */
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

  /**
   * Creates a new node or relation.
   *
   * If the created element is a node, it will become part of the root level, i.e. returned by the get index endpoint.
   * Relations, on the other hand, will be created between their start and end nodes.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * const nodeId = await apiWrapper.postIndex({
   *   type: 'Data',
   *   data: {
   *     some: 'data'
   *   }
   * });
   * ```
   *
   * @see [Ember Nexus API: Create root level element endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/post-index)
   */
  public async postIndex(element: NodeWithOptionalId | RelationWithOptionalId): Promise<Uuid> {
    const parsedResponse = await this.postIndexEndpoint.postIndex(element);
    return parsedResponse.data;
  }

  /**
   * Creates a new node.
   *
   * The created node will be saved as a child of the referenced parent node.
   *
   * **Note**: This endpoint can not be used to create relations, as relations can not be the child of some parent.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * const nodeId = await apiWrapper.postElement(
   *   '3175a7a0-b510-4554-94b0-242badcf0d32',
   *   {
   *     type: 'Data',
   *     data: {
   *       some: 'data'
   *     }
   *   }
   * );
   * ```
   *
   * @see [Ember Nexus API: Create element endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/post-element)
   */
  public async postElement(parentId: Uuid, element: NodeWithOptionalId): Promise<Uuid> {
    const parsedResponse = await this.postElementEndpoint.postElement(parentId, element);
    return parsedResponse.data;
  }

  /**
   * Replaces an element's data.
   *
   * The provided data will replace the element's existing data.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * await apiWrapper.putElement(
   *   'a22b1d7c-5970-4d93-8e86-f6a6f01ca172',
   *   {
   *     some: 'new data'
   *   }
   * );
   * ```
   *
   * @see [Ember Nexus API: Replace element endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/put-element)
   */
  public async putElement(elementId: Uuid, data: Data): Promise<void> {
    await this.putElementEndpoint.putElement(elementId, data);
    this.elementCache.delete(ElementCache.createCacheKey(elementId));
  }

  /**
   * Updates an element.
   *
   * The provided data will be appended to the element's existing data. Existing properties will be overwritten if the
   * new data contains identical property keys.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * await apiWrapper.patchElement(
   *   'adc387a6-7f6c-49d5-a9fa-df3b5bf0c14f',
   *   {
   *     some: 'new data'
   *   }
   * );
   * ```
   *
   * @see [Ember Nexus API: Update element endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/patch-element)
   */
  public async patchElement(elementId: Uuid, data: Data): Promise<void> {
    await this.patchElementEndpoint.patchElement(elementId, data);
    this.elementCache.delete(ElementCache.createCacheKey(elementId));
  }

  /**
   * Deletes an element.
   *
   * @example
   * ```ts
   * const apiWrapper = serviceResolver.getServiceOrFail<ApiWrapper>(ApiWrapper.identifier);
   * await apiWrapper.deleteElement('f15abfb5-af82-45d0-96db-27766cbfd941');
   * ```
   *
   * @see [Ember Nexus API: Delete element endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/delete-element)
   */
  public async deleteElement(elementId: Uuid): Promise<void> {
    await this.deleteElementEndpoint.deleteElement(elementId);
    this.elementCache.delete(ElementCache.createCacheKey(elementId));
  }

  public async postRegister(
    uniqueUserIdentifier: UniqueUserIdentifier,
    password: string,
    data: Data = {},
  ): Promise<Uuid> {
    const parsedResponse = await this.postRegisterEndpoint.postRegister(uniqueUserIdentifier, password, data);
    return parsedResponse.data;
  }

  public async postChangePassword(
    uniqueUserIdentifier: UniqueUserIdentifier,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.postChangePasswordEndpoint.postChangePassword(uniqueUserIdentifier, currentPassword, newPassword);
  }

  public async getMe(): Promise<Node> {
    const parsedResponse = await this.getMeEndpoint.getMe();
    const node = parsedResponse.data;
    this.elementCache.setFromDataEtag(ElementCache.createCacheKey(node.id), node);
    return node;
  }

  public async postToken(
    uniqueUserIdentifier: UniqueUserIdentifier,
    password: string,
    data: Data = {},
  ): Promise<Token> {
    const parsedResponse = await this.postTokenEndpoint.postToken(uniqueUserIdentifier, password, data);
    return parsedResponse.data;
  }

  public async getToken(): Promise<Node> {
    const parsedResponse = await this.getTokenEndpoint.getToken();
    const node = parsedResponse.data;
    this.elementCache.setFromDataEtag(ElementCache.createCacheKey(node.id), node);
    return node;
  }

  public async deleteToken(): Promise<void> {
    await this.deleteTokenEndpoint.deleteToken();
  }
}

export { ApiWrapper };
