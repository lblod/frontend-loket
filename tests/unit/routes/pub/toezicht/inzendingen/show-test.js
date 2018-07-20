import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | pub/toezicht/inzendingen/show', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:pub/toezicht/inzendingen/show');
    assert.ok(route);
  });
});
