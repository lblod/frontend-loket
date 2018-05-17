import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized != null ? JSON.parse(serialized) : null;
  },

  serialize(deserialized) {
    return deserialized != null ? JSON.stringify(deserialized) : null;
  }
});
