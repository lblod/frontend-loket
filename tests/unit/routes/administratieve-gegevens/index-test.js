import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | administratieve-gegevens/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:administratieve-gegevens/index');
    assert.ok(route);
  });
});
