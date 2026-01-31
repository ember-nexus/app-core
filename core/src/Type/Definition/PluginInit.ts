import { ServiceResolver } from '../../Service/index.js';

/**
 * Function which every Ember Nexus compatible plugin must expose as its top level `init` export.
 */
type pluginInit = (serviceResolver: ServiceResolver) => Promise<void>;

/**
 * Function which every Ember Nexus compatible plugin must expose as its top level `optimizeDynamicConfigurations` export.
 */
type pluginOptimizeDynamicConfigurations = (serviceResolver: ServiceResolver) => Promise<void>;

export { pluginInit, pluginOptimizeDynamicConfigurations };
