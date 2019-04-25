import componentInitializer from '@lblod/ember-toezicht-form-fields/utils/component-initializer';
/**
 * 
 * @param {appInstance} appInstance 
 * This initializer will give precedence to our local components
 * over those from the @lblod/ember-mu-dynamic-forms addon
 * 
 */
export function initialize( appInstance ) {
  componentInitializer( appInstance );
}

export default {
  initialize
};