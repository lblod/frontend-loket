import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';

export default Model.extend({
  longName: computed('niveau', 'naam', function(){
    let niveau = this.niveau;
    let naam = this.naam;
    return `${naam} (${niveau})`;
  }),

  uri: attr(),
  naam: attr(),
  niveau: attr(),
  bestuurseenheid: hasMany('bestuurseenheid', { inverse: 'werkingsgebied' }),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "prov:Location",
    naam: "rdfs:label"
  }
});
