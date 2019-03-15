import Service from '@ember/service';

export default Service.extend({
  updateFormVersion(formVersion){
    this.set('formVersion', formVersion);
  }
});
