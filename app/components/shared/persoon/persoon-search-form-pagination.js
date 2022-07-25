import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PersoonSearchFormPagination extends Component {
  get currentPage() {
    return this.args.page ? parseInt(this.args.page) + 1 : 1;
  }

  get firstPage() {
    return this.args.links.first.number || 1;
  }

  get lastPage() {
    const max = this.args.links.last.number || -1;
    return max ? max + 1 : max;
  }

  get isFirstPage() {
    return this.firstPage === this.currentPage;
  }

  get isLastPage() {
    return this.lastPage === this.currentPage;
  }

  get hasMultiplePages() {
    return this.lastPage > 0;
  }

  get startItem() {
    return this.args.size * (this.currentPage - 1) + 1;
  }

  get endItem() {
    return this.startItem + this.args.nbOfItems - 1;
  }

  get pageOptions() {
    const nbOfPages = this.lastPage - this.firstPage + 1;
    return Array.from(
      new Array(nbOfPages),
      (_val, index) => this.firstPage + index
    );
  }

  @action
  changePage(link) {
    this.args.onSelectPage(link['number'] || 0);
  }
}
