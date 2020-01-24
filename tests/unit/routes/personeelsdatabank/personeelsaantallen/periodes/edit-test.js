import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | personeelsdatabank/personeelsaantallen/periodes/edit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:personeelsdatabank/personeelsaantallen/periodes/edit');
    assert.ok(route);
  });
});
