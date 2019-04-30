import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  uri: attr(),
  naam: attr(),
  bindingStart: attr('date'),
  bindingEinde: attr('date'),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: 'bestuursorganen' }),
  classificatie: belongsTo('bestuursorgaan-classificatie-code', { inverse: null }),
  isTijdsspecialisatieVan: belongsTo('bestuursorgaan', { inverse: 'heeftTijdsspecialisaties' }),
  wordtSamengesteldDoor: belongsTo('rechtstreekse-verkiezing', { inverse: 'steltSamen' }),
  heeftTijdsspecialisaties: hasMany('bestuursorgaan', { inverse: 'isTijdsspecialisatieVan' }),
  bevat: hasMany('mandaat', { inverse: null }),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    naam: "http://www.w3.org/2004/02/skos/core#prefLabel",
    class: "http://data.vlaanderen.be/ns/besluit#Bestuursorgaan",
    bindingStart: "http://data.vlaanderen.be/ns/mandaat#bindingStart",
    bindingEinde: "http://data.vlaanderen.be/ns/mandaat#bindingEinde",
    bestuurseenheid: "http://data.vlaanderen.be/ns/besluit#bestuurt",
    classificatie: "http://data.vlaanderen.be/ns/besluit#classificatie",
    isTijdsspecialisatieVan: "http://data.vlaanderen.be/ns/mandaat#isTijdspecialisatieVan",
    bevat: "http://www.w3.org/ns/org#hasPost"
  }
});
