import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | pub/toezicht/rapporten', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:pub/toezicht/rapporten');
    assert.ok(route);
  });
});
