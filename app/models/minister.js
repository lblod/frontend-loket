import { hasMany, belongsTo } from '@ember-data/model';
import AgentInPosition from './agent-in-position';

export default class MinisterModel extends AgentInPosition {
  @belongsTo('minister-position', { inverse: null })
  ministerPosition;
  @belongsTo('financing-code') financing;

  @hasMany('minister-condition') conditions;
}
