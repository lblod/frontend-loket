import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | berichtencentrum/berichten', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:berichtencentrum/berichten');
    assert.ok(controller);
  });
});
