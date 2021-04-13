import Model, { attr } from '@ember-data/model';

export default class SubsidyProceduralStepModel extends Model {
  @attr description;
  @attr('uri-set') type;
}
