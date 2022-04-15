import Model, { attr } from '@ember-data/model';
import { collect } from '@ember/object/computed';

export default class FunctionarisStatusCodeModel extends Model {
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  @collect.apply(this, ['id', 'label', 'scopeNote']) stringRep;

  @attr() uri;
  @attr() label;
  @attr() scopeNote;
}
