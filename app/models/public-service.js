import { belongsTo } from '@ember-data/model';
import ConceptualPublicServiceModel from './conceptual-public-service';

export default class PublicServiceModel extends ConceptualPublicServiceModel {
  @belongsTo('conceptual-public-service', { inverse: null })
  concept;
}
