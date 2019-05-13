import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';
import { belongsTo } from 'ember-data/relationships';
import { computed }  from '@ember/object';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'start', 'einde']),

  uri: attr(),
  start: attr('datetime'),
  einde: attr('datetime'),
  bekleedt: belongsTo('bestuursfunctie', { inverse: null }),
  status: belongsTo('functionaris-status-code', { inverse: null }),
  isBestuurlijkeAliasVan: belongsTo('persoon', { inverse: null }),

  datesAreCompatible: computed('start', 'einde', function(){
    return this.einde > this.start;
  })
});
