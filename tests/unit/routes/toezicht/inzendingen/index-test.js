import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | toezicht/inzendingen/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:toezicht/inzendingen/index');
    assert.ok(route);
  });
});
