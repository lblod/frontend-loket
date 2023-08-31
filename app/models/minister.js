import { hasMany, belongsTo } from '@ember-data/model';
import AgentInPosition from './agent-in-position';

export default class MinisterModel extends AgentInPosition {
  @belongsTo('minister-position', {
    async: true,
    inverse: 'heldByMinisters',
  })
  ministerPosition;

  @belongsTo('financing-code', {
    async: true,
    inverse: null,
  })
  financing;

  @hasMany('minister-condition', {
    async: true,
    inverse: null,
  })
  conditions;
}

export async function validateFunctie(worshipMinister) {
  let functie = await worshipMinister.ministerPosition;
  let isFunctie = Boolean(functie);
  if (!isFunctie) {
    // TODO: This works around a problem in Ember Data where adding an error without the record being in a dirty state triggers an exception.
    // Ember Data doesn't consider relationship changes a "dirty" change, so this causes issues if the adres is cleared.
    // This workaround uses `.send` but that is a private API which is no longer present in Ember Data 4.x
    // The bug is fixed in Ember Data 4.6 so we need to update to that version instead of 4.4 LTS
    // More information in the Discord: https://discord.com/channels/480462759797063690/1016327513900847134
    // Same old issue where they use this workaround: https://stackoverflow.com/questions/27698496/attempted-to-handle-event-becameinvalid-while-in-state-root-loaded-saved
    worshipMinister.send?.('becomeDirty');
    worshipMinister.errors.add(
      'ministerPosition',
      'functienaam is een vereist veld.'
    );
  }
  return isFunctie;
}
