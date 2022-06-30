import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { loadPublicServiceDetails } from 'frontend-loket/utils/public-services';
import RichTextEditor from 'frontend-loket/components/rdf-form-fields/rich-text-editor';
import { registerFormFields } from '@lblod/ember-submission-form-fields';

export default class PublicServicesDetailsRoute extends Route {
  @service store;

  constructor() {
    super(...arguments);

    this.registerCustomFormFields();
  }

  async model({ serviceId }) {
    let publicService = await loadPublicServiceDetails(this.store, serviceId);

    return {
      publicService,
    };
  }

  registerCustomFormFields() {
    registerFormFields([
      {
        displayType: 'http://lblod.data.gift/display-types/richText',
        edit: RichTextEditor,
      },
    ]);
  }
}
