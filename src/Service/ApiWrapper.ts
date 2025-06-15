import {
  GetElementChildrenEndpoint,
  GetElementEndpoint,
  GetElementParentsEndpoint,
  GetElementRelatedEndpoint,
  GetIndexEndpoint,
} from '../Endpoint/Element/index.js';
import { ServiceResolver } from '../Service/index.js';
import { Collection, Node, Relation, Uuid } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

class ApiWrapper {
  static identifier: ServiceIdentifier = ServiceIdentifier.serviceApiWrapper;

  constructor(
    private getElementEndpoint: GetElementEndpoint,
    private getElementChildrenEndpoint: GetElementChildrenEndpoint,
    private getElementParentsEndpoint: GetElementParentsEndpoint,
    private getElementRelatedEndpoint: GetElementRelatedEndpoint,
    private getIndexEndpoint: GetIndexEndpoint,
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
    );
  }

  public getElement(elementId: Uuid): Promise<Node | Relation> {
    return Promise.resolve()
      .then(() => this.getElementEndpoint.getElement(elementId))
      .then((endpointResponse) => {
        if (!endpointResponse.modified) {
          throw new Error('this should not happen');
        }
        return endpointResponse.data;
      });
  }

  public getElementParents(childId: Uuid, page: number = 1, pageSize: number = 25): Promise<Collection> {
    return this.getElementParentsEndpoint.getElementParents(childId, page, pageSize);
  }

  public getElementChildren(parentId: Uuid, page: number = 1, pageSize: number = 25): Promise<Collection> {
    return this.getElementChildrenEndpoint.getElementChildren(parentId, page, pageSize);
  }

  public getElementRelated(centerId: Uuid, page: number = 1, pageSize: number = 25): Promise<Collection> {
    return this.getElementRelatedEndpoint.getElementRelated(centerId, page, pageSize);
  }

  public getIndex(page: number = 1, pageSize: number = 25): Promise<Collection> {
    return this.getIndexEndpoint.getIndex(page, pageSize);
  }
}

export { ApiWrapper };
