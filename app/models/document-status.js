import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { equal } from '@ember/object/computed';

const documentStatusVerstuurdId = 'a30d1e2c-ccec-4dbf-972a-6117cc490914';

export default Model.extend({
  uri: attr(),
  label: attr(),

  isConcept: equal('uri', 'http://data.lblod.info/document-statuses/concept')
});

export { documentStatusVerstuurdId }
