import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | berichtencentrum/berichten/new', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:berichtencentrum/berichten/new');
    assert.ok(route);
  });
});
