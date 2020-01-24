import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | personeelsdatabank/personeelsaantallen/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:personeelsdatabank/personeelsaantallen/index');
    assert.ok(route);
  });
});
