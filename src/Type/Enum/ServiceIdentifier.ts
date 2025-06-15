enum ServiceIdentifier {
  // global services
  emberNexusWebSDK = 'ember-nexus.web-sdk',
  eventDispatcher = 'global.event-dispatcher',
  logger = 'global.logger',
  action = 'global.action-registry',
  setting = 'global.setting-registry',
  icon = 'global.icon-registry',

  // scoped services

  // services
  serviceFetchHelper = 'ember-nexus.app-core.service.fetch-helper-service',
  serviceApiConfiguration = 'ember-nexus.app-core.service.api-configuration-service',
  serviceElementParser = 'ember-nexus.app-core.service.element-parser-service',
  serviceCollectionParser = 'ember-nexus.app-core.service.collection-parser-service',
  serviceRawValueToNormalizedValueHelper = 'ember-nexus.app-core.service.raw-value-to-normalized-value-helper-service',
  serviceRequestProblemParser = 'ember-nexus.app-core.service.request-problem-parser-service',
  serviceTokenParser = 'ember-nexus.app-core.service.token-parser-service',
  serviceApiWrapper = 'ember-nexus.app-core.service.api-wrapper',

  // endpoints: element
  endpointElementDeleteElementEndpoint = 'ember-nexus.app-core.endpoint.element.delete-element-endpoint',
  endpointElementGetElementEndpoint = 'ember-nexus.app-core.endpoint.element.get-element-endpoint',
  endpointElementGetElementChildrenEndpoint = 'ember-nexus.app-core.endpoint.element.get-element-children-endpoint',
  endpointElementGetElementParentsEndpoint = 'ember-nexus.app-core.endpoint.element.get-element-parents-endpoint',
  endpointElementGetElementRelatedEndpoint = 'ember-nexus.app-core.endpoint.element.get-element-related-endpoint',
  endpointElementGetIndexEndpoint = 'ember-nexus.app-core.endpoint.element.get-index-endpoint',
  endpointElementPatchElementEndpoint = 'ember-nexus.app-core.endpoint.element.patch-element-endpoint',
  endpointElementPostElementEndpoint = 'ember-nexus.app-core.endpoint.element.post-element-endpoint',
  endpointElementPostIndexEndpoint = 'ember-nexus.app-core.endpoint.element.post-index-endpoint',
  endpointElementPutElementEndpoint = 'ember-nexus.app-core.endpoint.element.put-element-endpoint',

  // endpoints: user
  endpointUserDeleteTokenEndpoint = 'ember-nexus.app-core.endpoint.user.delete-token-endpoint',
  endpointUserGetMeEndpoint = 'ember-nexus.app-core.endpoint.user.get-me-endpoint',
  endpointUserGetTokenEndpoint = 'ember-nexus.app-core.endpoint.user.get-token-endpoint',
  endpointUserPostChangePasswordEndpoint = 'ember-nexus.app-core.endpoint.user.post-change-password-endpoint',
  endpointUserPostRegisterEndpoint = 'ember-nexus.app-core.endpoint.user.post-register-endpoint',
  endpointUserPostTokenEndpoint = 'ember-nexus.app-core.endpoint.user.post-token-endpoint',
}

export { ServiceIdentifier };
