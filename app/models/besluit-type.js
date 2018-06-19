import DS from 'ember-data';
import { hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  label: DS.attr(),
  decidableBy: hasMany('bestuurseenheid-classificatie-code', { inverse: null })
});
