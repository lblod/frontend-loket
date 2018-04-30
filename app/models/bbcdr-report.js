import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  created: attr('datetime'),
  modified: attr('datetime'),
  status: belongsTo('document-status'),
  lastModifier: belongsTo('gebruiker'),
  bestuurseenheid: belongsTo('bestuurseenheid'),
  files: hasMany('file')
});
