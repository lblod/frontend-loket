import Component from '@glimmer/component';
import { warn } from '@ember/debug';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isBlank } from '@ember/utils';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerMandatarisEditComponent extends Component {
  @service store;

  // STATIC
  dateFormat = 'DD-MM-YYYY';

  // ALL MODES THIS COMPONENT CAN BE IN
  @tracked createMode = false;
  @tracked editMode = false;
  @tracked promptMode = false;
  @tracked terminateMode = false;
  @tracked correctMode = false;

  // PROPERTIES
  @tracked mandataris;
  @tracked mandaat;
  @tracked status;
  @tracked beleidsdomeinen;
  @tracked rangorde;
  @tracked startDate;
  @tracked endDate;
  @tracked fractie;

  //ERRORS
  @tracked requiredFieldError = false;
  @tracked saveError = false;
  @tracked destroyOnError = A();

  get startDateError() {
    if(isBlank(this.startDate)) {
      return 'geplande start is een vereist veld';
    }

    if(this.endDate < this.startDate) {
      return 'geplande start moet voor gepland einde liggen';
    }

    return null;
  }

  get endDateError() {
    if(this.endDate < this.startDate) {
      return 'gepland einde moet na geplande start liggen';
    }

    return null;
  }

  constructor() {
    super(...arguments);
    this.initProperties();
  }

  initProperties() {
    this.mandataris = this.args.mandataris;
    this.mandaat = this.mandataris.bekleedt;
    this.status = this.mandataris.status;
    this.beleidsdomeinen = this.mandataris.beleidsdomein || A();
    this.fractie = this.mandataris.heeftLidmaatschap.get('binnenFractie');
    this.startDate = this.mandataris.start;
    this.rangorde = this.mandataris.get('rangorde.content');
    this.endDate = this.mandataris.einde;
    this.destroyOnError = A();
    this.toggleCreateMode();
  }


  toggleCreateMode(){
    if(!this.mandataris.id)
      this.createMode = true;
  }

  @action
  openEditPrompt(){
    this.editMode = false;
    this.promptMode = true;
  }

  @action
  correct(){
    this.promptMode = false;
    this.editMode = true;
    this.correctMode = !this.correctMode;
  }

  @action
  terminate(){
    this.promptMode = false;
    this.editMode = true;
    this.terminateMode = !this.terminateMode;
  }

  @action
  setMandaat(mandaat) {
    console.log(mandaat)
    this.mandaat = mandaat;
  }

  @action
  setStatusCode(status){
    this.status = status;
  }

  @action
  setBeleidsdomein(beleidsdomeinen){
    this.beleidsdomeinen = beleidsdomeinen;
  }

  @action
  setFractie(fractie){
    this.fractie = fractie;
  }

  /**  Temporary fix until we start using new datepicker. */
  @action
  preventPageRefresh(e) {
    e.preventDefault();
  }

  // MAIN SAVE ACTION
  @task
  *save() {
    try {
      this.saveError = false;
      this.requiredFieldError = false;

      yield this.saveNewBeleidsdomeinen();
      yield this.saveLidmaatschap();

      if(!this.mandaat || !this.status){
        this.requiredFieldError = true;
        return;
      }

      this.mandataris.bekleedt = this.mandaat;
      this.mandataris.beleidsdomein = this.beleidsdomeinen;
      this.mandataris.start = this.startDate;
      this.mandataris.einde = this.endDate;

      if(this.rangorde) {
        this.mandataris.rangorde = { content: this.rangorde, language: 'nl' };
      } else {
        this.mandataris.rangorde = undefined;
      }

      this.mandataris.status = this.status;

      yield this.mandataris.save();
      this.resetView();
    }
    catch (e){
      this.saveError = true;
      warn(`error during save ${e}`, { id: 'save-error' });
      this.cleanUpOnError();
    }
  }

  async saveNewBeleidsdomeinen(){
    let savingD = this.beleidsdomeinen.map(async beleidsdomein => {
      if(beleidsdomein.isNew){
        await beleidsdomein.save();
        this.destroyOnError.pushObject(beleidsdomein);
      }
    });
    return Promise.all(savingD);
  }

  async saveLidmaatschap(){
    if(!this.mandataris.heeftLidmaatschap.get('id')){
      if (this.fractie) {
        await this.createNewLidmaatschap();
        return;
      }
      else {
        // old and new fraction are both undefined. Nothing needs to be done...
        return;
      }
    }

    // if new and old fractie are both onafhankelijk, nothing needs to be done...
    let currFractie = await this.mandataris.heeftLidmaatschap.get('binnenFractie');
    if(currFractie && (await currFractie.fractietype.get('isOnafhankelijk')) && this.fractie.fractietype.get('isOnafhankelijk')){
      return;
    }

    if((this.mandataris.heeftLidmaatschap.get('binnenFractie.id') !== this.fractie.get('id'))){
      await this.updateLidmaatschap();
      return;
    }
    if(!this.fractie)
      return;
    this.mandataris.heeftLidmaatschap.tijdsinterval = await this.getTijdsinterval(this.startDate, this.endDate);
  }

  async createNewLidmaatschap(){
    let tijdsinterval = await this.getTijdsinterval(this.startDate, this.endDate);
    let fractie = this.fractie;

    if(!this.fractie.get('id')){
      await fractie.save();
    }

    let lidmaatschap =  await this.store.createRecord('lidmaatschap', {
      binnenFractie: fractie,
      lidGedurende: tijdsinterval
    });
    await lidmaatschap.save();

    this.destroyOnError.pushObject(lidmaatschap);
    this.mandataris.heeftLidmaatschap = lidmaatschap;
  }

  async getTijdsinterval(begin, einde){
    let tijdsinterval = await this.findTijdsinterval(begin, einde);
    if(!tijdsinterval){
      tijdsinterval = this.store.createRecord('tijdsinterval', {begin, einde});
      await tijdsinterval.save();
      this.destroyOnError.pushObject(tijdsinterval);
    }
    return tijdsinterval;
  }

  async findTijdsinterval(startDate, endDate){
    let begin = startDate ? startDate.toISOString().substring(0, 10) : '';
    let einde = endDate ? endDate.toISOString().substring(0, 10) : '';
    return await this.store.query('tijdsinterval',{filter: {begin, einde}});
  }

  async cleanUpOnError(){
    //TODO: better rollback of relations
    this.mandataris.rollbackAttributes();
    this.destroyOnError.forEach(o => {
        o.destroyRecord();
    });
  }

  @action
  cancel(){
    this.initProperties();
    if(this.createMode){
      this.createMode = false;
      this.args.onCancelCreate(this.mandataris);
    } else {
      this.resetView();
    }
  }

  resetView() {
    if(!this.hasFatalError){
      this.createMode = false;
      this.promptMode = false;
      this.editMode = false;
      this.terminateMode = false;
      this.correctMode = false;

    }
  }
}
