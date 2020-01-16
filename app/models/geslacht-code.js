import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { equal } from '@ember/object/computed';

export default Model.extend({
  uri: attr(),
  label: attr(),

  isMale: equal('id', '5ab0e9b8a3b2ca7c5e000028')
});
