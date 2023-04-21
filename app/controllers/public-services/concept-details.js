import Controller from '@ember/controller';

export default class PublicServicesConceptDetailsController extends Controller {
  queryParams = [{ isPreview: 'preview', publicServiceId: 'id' }];
  isPreview = false;
  publicServiceId = '';

  get isLinkFlowPreview() {
    return Boolean(this.publicServiceId);
  }
}
