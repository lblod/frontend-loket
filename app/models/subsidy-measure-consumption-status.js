import Model, { attr } from '@ember-data/model';

export const STATUS = {
  SENT: 'http://lblod.data.gift/concepts/2ea29fbf-6d46-4f08-9343-879282a9f484',
  ACTIVE: 'http://lblod.data.gift/concepts/c849ca98-455d-4f31-9e95-a3d9d06e4497',
  CONCEPT: 'http://lblod.data.gift/concepts/6373b454-22b6-4b65-b98f-3d86541f2fcf',
};

export default class SubsidyMeasureConsumptionStatusModel extends Model {
  @attr uri;
  @attr label;

  uriEquals(status) {
    return this.uri === status;
  }

  isSent() {
    return this.uriEquals(STATUS.SENT);
  }

  isActive() {
    return this.uriEquals(STATUS.ACTIVE);
  }

  isConcept() {
    return this.uriEquals(STATUS.CONCEPT);
  }
}
