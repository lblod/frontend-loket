import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getPublicServiceCta } from '../utils/get-public-service-cta';

export default class FavoritesController extends Controller {
  @tracked selectedProduct;

  @action
  async openProductDetail(product) {
    const website = await getPublicServiceCta(product);
    if (website) {
      window.open(website.url, '_blank');
    } else {
      this.selectedProduct = product;
    }
  }

  @action
  closeProductDetail() {
    this.selectedProduct = null;
  }
}
