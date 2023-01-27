import Controller from '@ember/controller';

export default class PublicServicesConceptDetailsController extends Controller {
  queryParams = [{ isPreview: 'preview' }];
  isPreview = false;
}
