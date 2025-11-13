// Simplified version of the ember-composable-helper helper since we still use it in some places
// and we were depending on the ember-composable-helpers dependency of ember-data-table by accident.
// https://github.com/NullVoxPopuli/ember-composable-helpers/blob/c87d96507c3ce15d34f23da2de9e3e08382dde5e/ember-composable-helpers/src/helpers/repeat.ts
export default function repeat(length, value) {
  return Array.apply(null, { length }).map(() => value);
}
