import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
import moment from 'moment';

export default Controller.extend({
  disableSave: computed('mandaat', 'start', function(){
    return !(this.get('mandaat') && this.get('start'));
  }),

  disableCancel: computed('save.isIdle', function(){
    return !this.save.isIdle;
  }),

  save: task(function* (){
    yield this.createNewBeleidsdomeinen();

    let lidmaatschap;

    if(this.get('fractie')){
      lidmaatschap = yield this.createLidmaatschap();
    }

    let mandataris = yield this.get('store').createRecord('mandataris', {
      start: this.get('start'),
      einde: this.get('einde'),
      bekleedt: this.get('mandaat'),
      heeftLidmaatschap: lidmaatschap,
      isBestuurlijkeAliasVan: this.get('persoon'),
      beleidsdomein: this.get('beleidsdomeinen')
    });

    return mandataris.save();
  }).drop(),

  async createNewBeleidsdomeinen(){
    if(!this.get('beleidsdomeinen')){
      this.set('beleidsdomeinen', A());
      return;
    }

    //TODO: should we cleanup on fail?
    let savingD = this.get('beleidsdomeinen').map(d => {
      if(d.get('isNew'))
         return d.save();
    });
    
    return Promise.all(savingD);
  },

  async createLidmaatschap(){
    let fractie = this.get('fractie');
    let tijdsinterval = await this.get('store').createRecord('tijdsinterval', {
      begin: this.get('start'), einde: this.get('einde')
    });
    await tijdsinterval.save();

    try{
      let lidmaatschap =  await this.get('store').createRecord('lidmaatschap', {
        binnenFractie: fractie, lidGedurende: tijdsinterval
      });
      await lidmaatschap.save();
      return lidmaatschap;
    }
    catch (error){
      await tijdsinterval.delete();
      throw error;
    }
  },

  parseDate(){

  },

  actions: {
    async setPersoon(persoon){
      this.set('persoon', persoon);
    },
    setFractie(fractie){
      this.set('fractie', fractie);
    },
    setMandaat(mandaat){
      this.set('mandaat', mandaat);
    },
    setBeleidsdomeinen(beleidsdomeinen){
      this.set('beleidsdomeinen', beleidsdomeinen);
    },
    async save(){
      let mandataris = await this.save.perform();
      alert('ready');
    },
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
