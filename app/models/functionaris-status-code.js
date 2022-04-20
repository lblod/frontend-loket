import Model, { attr } from '@ember-data/model';

export default class FunctionarisStatusCodeModel extends Model {
  @attr uri;
  @attr label;
  @attr scopeNote;
}
