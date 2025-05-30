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
  apiConfiguration = 'ember-nexus.app-core.api-configuration',
  fetchHelper = 'ember-nexus.app-core.fetch-helper',

  // endpoints
  endpointElementGetElementEndpoint = 'ember-nexus.app-core.element.endpoint.get-element-endpoint',
}

export { ServiceIdentifier };
