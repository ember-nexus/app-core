enum ServiceIdentifier {
  // global services
  emberNexusWebSDK = 'ember-nexus.web-sdk',
  eventDispatcher = 'global.event-dispatcher',
  logger = 'global.logger',
  action = 'global.action-registry',
  setting = 'global.setting-registry',
  icon = 'global.icon-registry',

  // scoped services
  elementParser = 'ember-nexus.app-core.element-parser',
  collectionParser = 'ember-nexus.app-core.collection-parser',
  apiConfiguration = 'ember-nexus.app-core.api-configuration',
  fetchHelper = 'ember-nexus.app-core.fetch-helper',
  tokenParser = 'ember-nexus.app-core.token-parser',

  // endpoints: element
  endpointElementGetElementEndpoint = 'ember-nexus.app-core.endpoint.element.get-element-endpoint',
  endpointElementGetElementChildrenEndpoint = 'ember-nexus.app-core.endpoint.element.get-element-children-endpoint',
  endpointElementGetElementParentsEndpoint = 'ember-nexus.app-core.endpoint.element.get-element-parents-endpoint',
  endpointElementGetElementRelatedEndpoint = 'ember-nexus.app-core.endpoint.element.get-element-related-endpoint',
  endpointElementGetIndexEndpoint = 'ember-nexus.app-core.endpoint.element.get-index-endpoint',
  endpointElementDeleteElementEndpoint = 'ember-nexus.app-core.endpoint.element.delete-element-endpoint',
  endpointElementPostIndexEndpoint = 'ember-nexus.app-core.endpoint.element.post-index-endpoint',
  endpointElementPostElementEndpoint = 'ember-nexus.app-core.endpoint.element.post-element-endpoint',
  endpointElementPatchElementEndpoint = 'ember-nexus.app-core.endpoint.element.patch-element-endpoint',
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
