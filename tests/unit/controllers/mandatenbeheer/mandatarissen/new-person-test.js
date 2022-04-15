import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module(
  'Unit | Controller | mandatenbeheer/mandatarissen/new-person',
  function (hooks) {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function (assert) {
      let controller = this.owner.lookup(
        'controller:mandatenbeheer/mandatarissen/new-person'
      );
      assert.ok(controller);
    });
  }
);
