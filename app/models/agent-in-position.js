import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class AgentInPositionModel extends Model {
  @attr('date') agentStartDate;
  @attr('date') agentEndDate;

  @belongsTo('post', {
    async: true,
    inverse: 'agentsInPosition',
    polymorphic: true,
    as: 'agent-in-position',
  })
  post;

  @belongsTo('persoon', { async: true, inverse: null }) person;

  @belongsTo('persoon', {
    async: true,
    inverse: 'isAangesteldAls',
    polymorphic: true,
    as: 'agent-in-position',
  })
  isBestuurlijkeAliasVan;

  @hasMany('contact-punt', {
    async: true,
    inverse: 'agentsInPosition',
    polymorphic: true,
    as: 'agent-in-position',
  })
  contacts;
}
