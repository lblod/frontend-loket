import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default class GeslachtCodeModel extends Model {
  @attr() uri;
  @attr() label;

  @equal('id', '5ab0e9b8a3b2ca7c5e000028') isMale;
}
