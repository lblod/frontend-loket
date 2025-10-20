import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @service router;
  @service currentSession;

  @tracked searchTerm;
  @tracked selectedProduct;
  suggestions = [
    'jeugddecreet',
    'immaterieel erfgoed',
    'investeringssubsidie',
    'projectsubsidie',
  ];

  @action
  search(e) {
    e.preventDefault();
    this.router.transitionTo('search', {
      queryParams: {
        page: 0,
        searchTerm: this.searchTerm,
      },
    });
  }

  @action
  updateSearchTerm(e) {
    this.searchTerm = e.target.value;
  }

  @action
  resetSearch() {
    this.searchTerm = null;
  }

  @action
  openProductDetail(product) {
    this.selectedProduct = product;
  }

  @action
  closeProductDetail() {
    this.selectedProduct = null;
  }
}
