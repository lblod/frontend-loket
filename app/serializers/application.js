/* eslint-disable ember/no-mixins */
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer.extend(
  DataTableSerializerMixin,
) {
  serializeAttribute(snapshot, json, key, attributes) {
    if (key !== 'uri')
      super.serializeAttribute(snapshot, json, key, attributes);
  }
}
