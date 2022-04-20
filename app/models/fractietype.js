import Model, { attr } from '@ember-data/model';

export default class FractietypeModel extends Model {
  @attr uri;
  @attr label;

  get isOnafhankelijk() {
    return (
      this.uri ===
      'http://data.vlaanderen.be/id/concept/Fractietype/Onafhankelijk'
    );
  }

  get isSamenwerkingsverband() {
    return (
      this.uri ===
      'http://data.vlaanderen.be/id/concept/Fractietype/Samenwerkingsverband'
    );
  }
}
