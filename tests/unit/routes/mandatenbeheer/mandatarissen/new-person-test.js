import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | mandatenbeheer/mandatarissen/new-person', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:mandatenbeheer/mandatarissen/new-person');
    assert.ok(route);
  });
});
