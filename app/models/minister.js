import { hasMany, belongsTo } from '@ember-data/model';
import AgentInPosition from './agent-in-position';

export default class MinisterModel extends AgentInPosition {
  @belongsTo('minister-position', { inverse: 'heldByMinisters' })
  ministerPosition;

  @belongsTo('financing-code', { inverse: null }) financing;
  @hasMany('minister-condition', { inverse: null }) conditions;
}
