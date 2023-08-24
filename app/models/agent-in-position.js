import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class AgentInPositionModel extends Model {
  @attr('date') agentStartDate;
  @attr('date') agentEndDate;

  @belongsTo('post', {
    inverse: 'agentsInPosition',
    polymorphic: true,
    as: 'agent-in-position',
  })
  post;

  @belongsTo('persoon', { inverse: null }) person;

  @belongsTo('persoon', {
    inverse: 'isAangesteldAls',
    polymorphic: true,
    as: 'agent-in-position',
  })
  isBestuurlijkeAliasVan;

  @hasMany('contact-punt', {
    inverse: 'agentsInPosition',
    polymorphic: true,
    as: 'agent-in-position',
  })
  contacts;
}
