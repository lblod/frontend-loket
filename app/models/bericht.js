import DS from 'ember-data';
const { attr } = DS;
import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  verzonden: attr('datetime'),
  aangekomen: attr('datetime'),
  inhoud: attr('string'),
  van: belongsTo('bestuurseenheid'),
  auteur: belongsTo('gebruiker'),
  naar: belongsTo('bestuurseenheid'),

  bijlagen: hasMany('file')
});
