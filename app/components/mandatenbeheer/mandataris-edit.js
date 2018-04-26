import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { observer } from '@ember/object';
import { isBlank } from '@ember/utils';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),
  dateFormat: 'DD-MM-YYYY',
  editOnlyMode: false, //some components will change behaviour when being in editMode
  saveError: false,

  async didReceiveAttrs(){
    this.set('destroyOnError', A());
    this.set('saveError', false);
    this.set('fractie', await this.get('mandataris.heeftLidmaatschap.binnenFractie'));
    this.set('beleidsdomeinen', await this.get('mandataris.beleidsdomein'));
    this.set('mandaat', await this.get('mandataris.bekleedt'));
    this.set('startDate', this.get('mandataris.start'));
    this.set('endDate', this.get('mandataris.einde'));
    this.set('rangorde', this.get('mandataris.rangorde.content'));
    this.set('status', await this.get('mandataris.status'));
  },

  save: task(function* (){
    this.set('saveError', false);
    try {
      yield this.saveNewBeleidsdomeinen();
      //fractie is a complex object, requires some special flow
      yield this.saveLidmaatschap();

      if(this.get('mandaat'))
        this.set('mandataris.bekleedt', this.get('mandaat'));
      //TODO:  mandaat is mandatory
      if(this.get('beleidsdomeinen.length') > 0)
        this.get('mandataris.beleidsdomein').setObjects(this.get('beleidsdomeinen'));
      if(this.get('startDate'))
        this.set('mandataris.start', this.get('startDate'));
      if(this.get('endDate'))
        this.set('mandataris.einde', this.get('endDate'));
      if(this.get('rangorde'))
        this.set('mandataris.rangorde', {content: this.get('rangorde'), language: 'nl'});
      if(this.get('status'))
        this.set('mandataris.status', this.get('status'));

      return yield this.get('mandataris').save();
    }
    catch (e){
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

  validateStatus: observer('status', function(){
    this.set('statusError', null);
    if(!this.get('status') && this.get('editOnlyMode'))
      this.set('statusError', 'Gelieve een status op te geven.');
  }),

  valideerStartEnEinde: observer('startDate', 'endDate', function() {
    console.log('validating');
    const start = this.get('startDate');
    const end = this.get('endDate');
    this.set('startDateError', null);
    this.set('endDateError', null);
    console.log(start,end, end < start);
    if (isBlank(start))
      this.set('startDateError', 'geplande start is een vereist veld');
    if (start && end  && end < start ) {
      this.set('startDateError', 'geplande start moet voor gepland einde liggen');
      this.set('endDateError', 'gepland einde moet na geplande start liggen');
    }
  }),
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
    //TODO: better rollback of relations
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
