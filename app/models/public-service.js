import { belongsTo } from '@ember-data/model';
import ConceptualPublicServiceModel from './conceptual-public-service';

export default class PublicServiceModel extends ConceptualPublicServiceModel {
  @belongsTo('conceptual-public-service', { inverse: null })
  concept;

  get isSent() {
    return (
      this.status.uri ===
      'http://lblod.data.gift/concepts/9bd8d86d-bb10-4456-a84e-91e9507c374c'
    );
  }
}
