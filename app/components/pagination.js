import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Pagination extends Component {
  get sizeOptions() {
    return [10, 25, 50, 100];
  }

  get page() {
    return this.args.page || 0;
  }

  get size() {
    return this.args.size || 20;
  }

  get start() {
    return this.args.total == 0 ? 0 : this.page * this.size + 1;
  }

  get end() {
    const end = this.page * this.size + this.size;
    return end > this.args.total ? this.args.total : end;
  }

  get hasPrevious() {
    return this.page > 0;
  }

  get hasNext() {
    return this.end < this.args.total;
  }

  get previousPage() {
    return this.args.page - 1;
  }

  get nextPage() {
    return this.args.page + 1;
  }

  @action
  setPageSize(event) {
    const size = parseInt(event.target.value);
    this.args.onChangeSize(size);
  }
}
