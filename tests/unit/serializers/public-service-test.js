import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { ALLOWED_FIELDS } from 'frontend-loket/serializers/public-service';

module('Unit | Serializer | public service', function (hooks) {
  setupTest(hooks);

  test('it only serializes the allowed fields', function (assert) {
    assert.expect(2);

    let store = this.owner.lookup('service:store');
    store.push({
      data: {
        id: '1',
        type: 'public-service',
        attributes: {
          name: [
            { content: 'foo', language: 'en' },
            { content: 'bar', language: 'nl' },
          ],
          uri: 'http://foo.bar/1234',
        },
        relationships: {
          status: { data: { id: '1', type: 'concept' } },
          conceptTags: {
            data: [
              {
                id: '2',
                type: 'concept',
              },
              {
                id: '3',
                type: 'concept',
              },
            ],
          },
        },
      },
    });

    let record = store.peekRecord('public-service', '1');
    record.modified = new Date();

    let serializedRecord = record.serialize();
    let serializedAttributeNames = Object.keys(
      serializedRecord.data.attributes
    );
    let serializedRelationshipNames = Object.keys(
      serializedRecord.data.relationships
    );

    for (let attribute of serializedAttributeNames) {
      assert.true(
        ALLOWED_FIELDS.includes(attribute),
        'The attribute is allowed to be serialized'
      );
    }

    for (let relationship of serializedRelationshipNames) {
      assert.true(
        ALLOWED_FIELDS.includes(relationship),
        'The relationship is allowed to be serialized'
      );
    }
  });
});
