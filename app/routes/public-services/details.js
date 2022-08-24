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
    const publicService = await loadPublicServiceDetails(this.store, serviceId);
    const status = await publicService.status;
    const readOnly =
      status.uri !==
      'http://lblod.data.gift/concepts/79a52da4-f491-4e2f-9374-89a13cde8ecd';
    return {
      publicService,
      readOnly,
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
