import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | supervision/submissions', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:supervision/submissions');
    assert.ok(route);
  });
});
