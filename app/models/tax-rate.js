import DS from 'ember-data';

export default DS.Model.extend({
  amount: DS.attr('number'),
  unit: DS.attr('string'),
  base: DS.attr('string'),
  remark: DS.attr('string')
});
