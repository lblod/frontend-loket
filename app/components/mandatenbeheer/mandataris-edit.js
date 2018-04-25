import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),
  dateFormat: 'DD-MM-YYYY',
  editOnlyMode: false, //some components will change behaviour when being in editMode
  saveError: false,

  init(){
    this._super(...arguments);
    this.set('destroyOnError', A());
  },

  async didReceiveAttrs(){
    this.set('fractie', await this.get('mandataris.heeftLidmaatschap.binnenFractie'));
    this.set('beleidsdomeinen', await this.get('mandataris.beleidsdomein'));
    this.set('mandaat', await this.get('mandataris.bekleedt'));
    this.set('startDate', this.get('mandataris.start'));
    this.set('endDate', this.get('mandataris.einde'));
    this.set('rangorde', this.get('mandataris.rangorde.content'));
    this.set('status', await this.get('mandataris.status'));
  },

  save: task(function* (){
    try {
      yield this.saveNewBeleidsdomeinen();
      //fractie is a complex object, requires some special flow
      yield this.saveLidmaatschap();

      this.set('mandataris.bekleedt', this.get('mandaat'));
      this.get('mandataris.beleidsdomein').setObjects(this.get('beleidsdomeinen'));
      this.set('mandataris.start', this.get('startDate'));
      this.set('mandataris.einde', this.get('endDate'));
      this.set('mandataris.rangorde', {content: this.get('rangorde'), language: 'nl'});
      this.set('mandataris.status', this.get('status'));

      return this.get('mandataris').save();
    }
    catch (e){
      //TODO: needs refinment later
      this.set('saveError', true);
      console.log(`error during save ${e}`);
      this.cleanUpOnError();
    }
  }),

  async saveNewBeleidsdomeinen(){
    let savingD = this.get('beleidsdomeinen').map(async d => {
      if(d.get('isNew')){
        await d.save();
        this.get('destroyOnError').pushObject(d);
      }
    });
    return Promise.all(savingD);
  },

  async saveLidmaatschap(){
    if(!this.get('mandataris.heeftLidmaatschap.id')){
      await this.createNewLidmaatschap();
      return;
    }
    if(this.get('mandataris.heeftLidmaatschap.binnenFractie.id') !== this.get('fractie.id')){
      await this.updateLidmaatschap();
      return;
    }
    this.set('mandataris.heeftLidmaatschap.tijdsinterval', await this.getTijdsinterval(this.get('mandataris.start'), this.get('mandataris.einde')));
  },

  async updateLidmaatschap(){
    let lidmaatschap = await this.get('mandataris.heeftLidmaatschap');
    await lidmaatschap.destroyRecord();
    await this.createNewLidmaatschap();
  },

  async createNewLidmaatschap(){
    let tijdsinterval = await this.getTijdsinterval(this.get('mandataris.start'), this.get('mandataris.einde'));
    let fractie = this.get('fractie');

    let lidmaatschap =  await this.get('store').createRecord('lidmaatschap', {
      binnenFractie: fractie, lidGedurende: tijdsinterval
    });
    await lidmaatschap.save();

    this.get('destroyOnError').pushObject(lidmaatschap);
    this.set('mandataris.heeftLidmaatschap', lidmaatschap);
  },

  async getTijdsinterval(begin, einde){
    let tijdsinterval = await this.findTijdsinterval(begin, einde);
    if(!tijdsinterval){
      tijdsinterval = this.get('store').createRecord('tijdsinterval', {begin, einde});
      await tijdsinterval.save();
      this.get('destroyOnError').pushObject(tijdsinterval);
    }
    return tijdsinterval;
  },

  async findTijdsinterval(startDate, endDate){
    let begin = startDate ? startDate.toISOString().substring(0, 10) : '';
    let einde = endDate ? endDate.toISOString().substring(0, 10) : '';
    return await this.get('store').query('tijdsinterval',{filter: {begin, einde}});
  },

  async cleanUpOnError(){
    this.get('mandataris').rollbackAttributes();
    this.get('destroyOnError').forEach(o => {
        o.destroyRecord();
    });
  },

  actions: {
    setFractie(fractie){
      this.set('fractie', fractie);
    },

    setMandaat(mandaat){
      this.set('mandaat', mandaat);
    },

    setBeleidsdomein(beleidsdomeinen){
      this.set('beleidsdomeinen', beleidsdomeinen);
    },

    setStatusCode(status){
      this.set('status', status);
    },

    async save(){
      let mandataris = await this.save.perform();
      if(!this.get('saveError'))
        this.get('onSave')(mandataris);
    },

    cancel(){
      this.get('onCancel')();
    },

    previous(){
      this.get('onPrevious')();
    }
  }
});
