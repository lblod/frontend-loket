import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { task } from 'ember-concurrency';
export default Controller.extend({
  positieSort: Object.freeze(['rol.label']),
  sortedPosities: sort('model.posities', 'positieSort'),
  isGemeente: computed('model.classificatie.id', function () {
    return this.get('model.classificatie.id') === '5ab0e9b8a3b2ca7c5e000001';
  }),
  saveContactInfo: task( function * (){
    this.set('contactErrorMessage', null);
    try {
      const adres = yield this.get('model.primaireSite.vestigingsadres');
      yield adres.save();
    }
    catch (e) {
      this.set('contactErrorMessage', e.message);
    }
  }),
  savePositions: task( function * () {
    this.set('positionsErrorMessage', null);
    try {
      const positions = yield this.get('model.posities');
      yield Promise.all(positions.map(async (positie) => {
        const person = await positie.get('wordtIngevuldDoor');
        return person.save();
      }));
    }
    catch (e) {
      this.set('positionsErrorMessage', e.message);
    }
  }),
  savePolitiezone: task( function * () {
    this.set('politiezoneErrorMessage', null);
    try {
      const pzone = yield this.get('model.politiezone');
      yield pzone.save();
      let cInfo = yield pzone.get('contactinfo');
      cInfo = yield cInfo.get('firstObject');
      yield cInfo.save();
      const positions = yield pzone.get('posities');
      yield Promise.all(positions.map(async (positie) => {
        const person = await positie.get('wordtIngevuldDoor');
        return person.save();
      }));
    }
    catch (e) {
      this.set('politiezoneErrorMessage', e.message);
    }
  })
});
