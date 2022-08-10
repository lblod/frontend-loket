import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class AgentInPositionModel extends Model {
  @attr agentStartDate;
  @attr agentEndDate;

  @belongsTo('post', { inverse: null }) post;
  @belongsTo('persoon') person;
  @belongsTo('persoon', { inverse: null }) isBestuurlijkeAliasVan;

  @hasMany('contact-punt', { inverse: null }) contacts;

  get startDate() {
    return this.agentStartDate || null;
  }

  get eindeDate() {
    return this.agentEndDate || null;
  }

  get postie() {
    return this.post || null;
  }

  get voornaam() {
    return (
      this.person.get('gebruikteVoornaam') ||
      this.isBestuurlijkeAliasVan.get('gebruikteVoornaam') ||
      null
    );
  }

  get achternaam() {
    return (
      this.person.get('achternaam') ||
      this.isBestuurlijkeAliasVan.get('achternaam') ||
      null
    );
  }
}
