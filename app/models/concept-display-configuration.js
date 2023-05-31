import Model, { attr } from '@ember-data/model';

export default class ConceptDisplayConfigurationModel extends Model {
  @attr isNewConcept;
  @attr isInstantiated;
}
