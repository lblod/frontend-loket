/* eslint-disable ember/no-runloop */
import Modifier from 'ember-modifier';
import { next, scheduleOnce } from '@ember/runloop';

// This modifier is a copy of the `@zestia/ember-auto-focus` addon (v5.2.1): https://github.com/zestia/ember-auto-focus/blob/973e00749e6c4e9ab443b3bee08fbf7937a5bb4b/addon/modifiers/auto-focus.js
// We inline the implementation since they no longer publish to npm and the implementation is very small anyways.
// TODO: We should re-evaluate the usage of this since it has accessibility implications and we might not need this modifier in the future.
export default class AutoFocusModifier extends Modifier {
  didSetup = false;

  modify(element, positional, named) {
    if (this.didSetup) {
      return;
    }

    this.didSetup = true;

    const { disabled } = named;

    if (disabled) {
      return;
    }

    const [selector] = positional;

    if (selector) {
      element = element.querySelector(selector);
    }

    if (!element) {
      return;
    }

    scheduleOnce('afterRender', this, afterRender, element, named);
  }
}

function afterRender(element, options) {
  if (element.contains(document.activeElement)) {
    return;
  }

  focus(element, options);
}

function focus(element, options) {
  element.dataset.programmaticallyFocused = 'true';
  element.focus(options);
  next(() => delete element.dataset.programmaticallyFocused);
}
