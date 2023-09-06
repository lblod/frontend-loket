import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
// import { inject as service } from '@ember/service';

export default class CoreDataEditController extends Controller {
  // @service currentSession;

  @task
  *save(event) {
    event.preventDefault();
    const { address, coreData } = this.model;
    console.log('Before validation');
    yield Promise.all([coreData.validate(), address.validate()]);
    console.log('After validation');
  }
}
