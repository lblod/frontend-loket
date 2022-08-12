import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Serializer | subsidy application form', function (hooks) {
  setupTest(hooks);

  test('it does not serialize the projectName attribute', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('subsidy-application-form', {
      projectName: 'foo',
    });

    let serializedRecord = record.serialize();

    assert.notOk(serializedRecord.data.attributes['project-name']);
  });

  test('it does not serialize the uri attribute', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('subsidy-application-form', {
      uri: 'https://foo.bar',
    });

    let serializedRecord = record.serialize();
    assert.notOk(serializedRecord.data.attributes['uri']);
  });
});
