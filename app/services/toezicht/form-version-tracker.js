import Service from '@ember/service';

export default Service.extend({
  updateFomVersion(formVersion){
    this.set('formVersion', formVersion);
  }
});
