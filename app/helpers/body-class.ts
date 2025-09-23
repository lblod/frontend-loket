// Copied from: https://github.com/universal-ember/ember-primitives/blob/f873f4f732a3ac7f6fa1ae9ff96365c0a904280f/ember-primitives/src/helpers/body-class.ts
// TODO: remove this once we install ember-primitives as a dependency
import Helper from '@ember/component/helper';
import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('ember-primitives:body-class:raf');

let id = 0;
const registrations = new Map<number, string[]>();
let previousRegistrations: string[] = [];

function classNames(): string[] {
  const allNames = new Set<string>();

  for (const classNames of registrations.values()) {
    for (const className of classNames) {
      allNames.add(className);
    }
  }

  return [...allNames];
}

let frame: number;
let waiterToken: unknown;

function queueUpdate() {
  waiterToken ||= waiter.beginAsync();

  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    updateBodyClass();
    waiter.endAsync(waiterToken);
    waiterToken = undefined;
  });
}

/**
 * This should only add/remove classes that we tried to maintain via the body-class helper.
 *
 * Folks can set classes in their html and we don't want to mess with those
 */
function updateBodyClass() {
  const toAdd = classNames();

  for (const name of previousRegistrations) {
    document.body.classList.remove(name);
  }

  for (const name of toAdd) {
    document.body.classList.add(name);
  }

  previousRegistrations = toAdd;
}

export interface Signature {
  Args: {
    Positional: [
      /**
       * a space-delimited list of classes to apply when this helper is called.
       *
       * When the helper is removed from rendering, the clasess will be removed as well.
       */
      classes: string,
    ];
  };
  /**
   * This helper returns nothing, as it is a side-effect that mutates and manages external state.
   */
  Return: undefined;
}

export default class BodyClass extends Helper<Signature> {
  localId = id++;

  compute([classes]: [string]): undefined {
    const classNames = classes ? classes.split(/\s+/) : [];

    registrations.set(this.localId, classNames);

    queueUpdate();
  }

  willDestroy() {
    registrations.delete(this.localId);
    queueUpdate();
  }
}

export const bodyClass = BodyClass;
