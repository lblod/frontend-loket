import Model, { attr } from '@ember-data/model';

export default class Invalidation extends Model {
  @attr('datetime') time;
  @attr comment;
  @attr seeAlso; // Uri of the resource
  @attr type; // Uri of the Concept
}
