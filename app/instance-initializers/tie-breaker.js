import registerMe from '@lblod/ember-toezicht-form-fields/utils/register-me';
/**
 * 
 * @param {appInstance} appInstance 
 * This initializer is where you can decide how to resolve duplicate names
 * Suppose you have multiple components with the same name in multiple addons,
 * here you can decide which one will be used.
 * 
 */
export function initialize( appInstance ) {
  registerMe( appInstance );
}

export default {
  initialize
};
