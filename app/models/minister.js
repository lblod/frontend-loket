import Model, { hasMany, belongsTo } from '@ember-data/model';
import AgentInPosition from './agent-in-position';

export default class MinisterModel extends AgentInPosition {
  @belongsTo('minister-position') ministerPosition;
  @belongsTo('financing-code') financing;

  @hasMany('minister-condition') conditions;
}
