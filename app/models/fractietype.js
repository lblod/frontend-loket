import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default class FractietypeModel extends Model {
  @attr uri;
  @attr label;

  @equal(
    'uri',
    'http://data.vlaanderen.be/id/concept/Fractietype/Onafhankelijk'
  )
  isOnafhankelijk;
  @equal(
    'uri',
    'http://data.vlaanderen.be/id/concept/Fractietype/Samenwerkingsverband'
  )
  isSamenwerkingsverband;
}
