import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { and, not } from 'ember-awesome-macros';
import { A } from '@ember/array';
import { all } from 'rsvp';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';


export default class BbcdrReportEditComponent extends Component {
  @service() router;
  @service() store;

  @and('args.report.status.isConcept', not('readyToSend')) enableUpload;

  @tracked showExitModal = false;
  @tracked showError = false;
  @tracked reportFiles =  this.args.report.files.toArray() || A([]);

  get readyToSend() {
    return this.reportFiles.length == 2
  }

  get readyForTmpSave() {
    return this.reportFiles.length >= 1
  }

  async updateReport() {
    this.args.report.set('files', this.reportFiles);
    this.args.report.set('modified', new Date());
    return this.args.report.save();
  }

  async deleteFilesAndReport(){
    const files = await this.args.report.files;
    await all(files.map(file => file.destroyRecord()));
    await this.args.report.destroyRecord();
  }

  hasOutstandingChanges(){
    if(this.args.report.hasDirtyAttributes && this.args.report.id)
      return true;
    if(this.didFilesChange)
      return true;
    return false;
  }

  @action
    async send() {
      this.showError = false;
      try {
        const statusSent = (await this.store.query('document-status', {
          filter: { ':uri:': 'http://data.lblod.info/document-statuses/verstuurd' }
        })).firstObject;
        this.args.report.set('status', statusSent);
        await this.updateReport();
        this.router.transitionTo('bbcdr.rapporten.index');
      }
      catch(e) {
        this.showError = true;
      }
    }

  @action
    async deleteReport() {
      await this.deleteFilesAndReport();
      this.router.transitionTo('bbcdr.rapporten.index');
    }

  @action
    async tempSave(){
      await this.updateReport();
      this.router.transitionTo('bbcdr.rapporten.edit', this.args.report.id);
    }

  @action
    async addFile(file) {
      this.reportFiles.pushObject(file);
      this.didFilesChange = true;
    }

  @action
    async deleteFile(file) {
      this.reportFiles.removeObject(file);
      this.didFilesChange = true;
    }

  @action
    async close(){
      if(this.isNewReport)
        await this.deleteReport();
      this.router.transitionTo('bbcdr.rapporten.index');
    }

  @action
    clickCloseCross(){
      if(this.hasOutstandingChanges())
        this.showExitModal = true;
      else
        this.router.transitionTo('bbcdr.rapporten.index');
    }

  @action
    cancelModal(){
      this.showExitModal = false;
    }

  @action
    async saveAndExitModal(){
      this.showExitModal = false;
      await this.updateReport();
      this.router.transitionTo('bbcdr.rapporten.index');
    }

  @action
    async discardAndExitModal(){
      this.showExitModal = false;
      if(this.isNewReport)
        await this.deleteReport();
      this.router.transitionTo('bbcdr.rapporten.index');
    }
}

