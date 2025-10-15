import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isEmpty } from '@ember/utils';
import constants from '../config/constants';

const { CONCEPT_SCHEMES } = constants;

export default class SearchController extends Controller {
  @service router;

  serviceTypeConceptScheme = CONCEPT_SCHEMES.SERVICE_TYPE_FILTER;
  themeConceptScheme = CONCEPT_SCHEMES.THEME_FILTER;
  authorityConceptScheme = CONCEPT_SCHEMES.COMPETENT_AUTHORITY_FILTER;

  sortingOptions = [
    { label: 'Relevantie', value: 'score' },
    { label: 'A-Z (oplopend)', value: 'name.nl.raw' },
    { label: 'Nieuwste', value: '-date-created' },
  ];

  @tracked page = 0;
  @tracked size = 25;
  @tracked sort = '-date-created';
  @tracked searchTerm;
  @tracked searchTermBuffer;
  // Array of record ids used as query param
  @tracked types = [];
  @tracked themes = [];
  @tracked authorities = [];
  // set in Route `setupController`
  @tracked themeRecords;
  @tracked typeRecords;
  @tracked authorityRecords;

  @action
  updateSearchTermBuffer(event) {
    this.searchTermBuffer = event.target.value;
  }

  @action
  search(event) {
    event.preventDefault();
    this.withUpdateSortAndResetPage(() => {
      this.searchTerm = this.searchTermBuffer;
    });
  }

  @action
  resetSearch() {
    this.withUpdateSortAndResetPage(() => {
      this.searchTermBuffer = null;
      this.searchTerm = null;
    });
  }

  @action
  updateThemeFilter(themes) {
    this.withUpdateSortAndResetPage(() => {
      this.themes = themes.map((record) => record.id);
    });
  }

  @action
  updateServiceTypeFilter(types) {
    this.withUpdateSortAndResetPage(() => {
      this.types = types.map((record) => record.id);
    });
  }

  @action
  updateAuthorityFilter(authorities) {
    this.withUpdateSortAndResetPage(() => {
      this.authorities = authorities.map((record) => record.id);
    });
  }

  withUpdateSortAndResetPage(callback) {
    const isEmptySearch = () => {
      return (
        isEmpty(this.searchTerm) &&
        isEmpty(this.themes) &&
        isEmpty(this.types) &&
        isEmpty(this.authorities)
      );
    };

    const searchWasEmpty = isEmptySearch();
    callback();
    const searchIsPresent = !isEmptySearch();

    if (searchWasEmpty && searchIsPresent) {
      // User started filering/searching => sort by 'score' by default
      this.sort = 'score';
    } else if (!searchWasEmpty && !searchIsPresent && this.sort == 'score') {
      // User stopped filering/searching => sort by 'newest' by default
      this.sort = '-date-created';
    }

    this.setPage(0);
  }

  @action
  setPage(page) {
    this.page = page;
  }

  @action
  setPageSize(size) {
    this.size = size;
    this.setPage(0);
  }

  @action
  setSorting(event) {
    this.sort = event.target.value;
  }

  @action
  openDetail(product) {
    this.router.transitionTo('search.product', product.id);
  }
}
