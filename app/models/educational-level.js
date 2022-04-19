import Model, { attr } from '@ember-data/model';

export default class EducationalLevelModel extends Model {
  @attr uri;
  @attr label;
}
