import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';

export default class PublicServicesLinkConceptIndexController extends Controller {
  queryParams = ['search', 'sort', 'page'];
  @tracked search = '';
  @tracked sort = 'name';
  @tracked page = 0;

  get concepts() {
    if (this.model.loadConcepts.isFinished) {
      return this.model.loadConcepts.value;
    }

    return this.model.loadedConcepts || [];
  }

  get isLoading() {
    return this.model.loadConcepts.isRunning;
  }

  get hasPreviousData() {
    return this.model.loadedConcepts?.length > 0;
  }

  get showTableLoader() {
    // TODO: Add a different loading state when the table already contains data
    // At the moment the table is cleared and the loading animation is shown.
    // It would be better to keep showing the already loaded data with a spinner overlay.
    // return this.isLoading && !this.hasPreviousData;

    return this.isLoading;
  }

  get hasResults() {
    return this.concepts.length > 0;
  }

  get hasErrored() {
    return this.model.loadConcepts.isError;
  }

  @restartableTask
  *searchTask(searchValue) {
    yield timeout(500);

    this.search = searchValue;
    this.page = 0;
  }
}
