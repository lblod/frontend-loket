import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask, restartableTask, timeout } from 'ember-concurrency';

export default class PublicServicesAddController extends Controller {
  @service router;
  @service store;

  queryParams = ['search', 'sector', 'sort', 'page'];
  @tracked search = '';
  @tracked sector = '';
  @tracked sort = 'name';
  @tracked page = 0;

  get publicServices() {
    if (this.model.loadPublicServices.isFinished) {
      return this.model.loadPublicServices.value;
    }

    return this.model.loadedPublicServices || [];
  }

  get isLoading() {
    return this.model.loadPublicServices.isRunning;
  }

  get hasPreviousData() {
    return this.model.loadedPublicServices?.length > 0;
  }

  get showTableLoader() {
    // TODO: Add a different loading state when the table already contains data
    // At the moment the table is cleared and the loading animation is shown.
    // It would be better to keep showing the already loaded data with a spinner overlay.
    // return this.isLoading && !this.hasPreviousData;

    return this.isLoading;
  }

  get hasResults() {
    return this.publicServices.length > 0;
  }

  get hasErrored() {
    return this.model.loadPublicServices.isError;
  }

  @restartableTask
  *searchTask(searchValue) {
    yield timeout(500);

    this.search = searchValue;
    this.page = 0;
  }

  @action
  handleSectorSelection(sector) {
    this.sector = sector?.id || '';
  }

  @dropTask
  *addPublicService(concept) {
    let publicService = this.store.createRecord('public-service');
    publicService.concept = concept;

    yield publicService.save();

    this.router.transitionTo('public-services.details', publicService.id);
  }
}
