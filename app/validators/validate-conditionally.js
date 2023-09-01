/**
 * Validator which conditionally runs other validators.
 * This is inspired by this addon https://github.com/skaterdav85/ember-changeset-conditional-validations.
 * Our version supports async validator and conditions functions but
 * it doesn't provide a helper to make retrieving values easier.
 *
 * @param {*} validators one or more validator function(s) which will be executed if the condition returns `true`
 * @param {*} condition Function which should return true if the validators should run.
 * @returns a conditional validator function
 */
export function validateConditionally(validators, condition) {
  return async function conditionalValidator(
    key,
    newValue,
    oldValue,
    changes,
    content
  ) {
    let shouldValidate = await condition(changes, content);

    if (shouldValidate) {
      if (Array.isArray(validators)) {
        for (const validator of validators) {
          const res = validator(key, newValue, oldValue, changes, content);
          if (res !== true) {
            return res;
          }
        }
        return true;
      } else {
        return validators(key, newValue, oldValue, changes, content);
      }
    } else {
      // Don't validtate
      return true;
    }
  };
}
