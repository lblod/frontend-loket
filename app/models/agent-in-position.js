import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class AgentInPositionModel extends Model {
  @attr('date') agentStartDate;
  @attr('date') agentEndDate;

  @belongsTo('post', { inverse: 'agentsInPosition' }) post;
  @belongsTo('persoon', { inverse: null }) person;
  @belongsTo('persoon', { inverse: 'isAangesteldAls' }) isBestuurlijkeAliasVan;

  @hasMany('contact-punt', { inverse: 'agentsInPosition' }) contacts;
}
