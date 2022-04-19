import Model, { attr } from '@ember-data/model';

export default class RolModel extends Model {
  @attr uri;
  @attr label;

  rdfaBindings = {
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel',
  };
}
