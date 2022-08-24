import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { registerFormFields } from '@lblod/ember-submission-form-fields';
import ConceptSelector from 'frontend-loket/components/rdf-form-fields/concept-selector';
import RichTextEditor from 'frontend-loket/components/rdf-form-fields/rich-text-editor';
import { loadPublicServiceDetails } from 'frontend-loket/utils/public-services';

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
      {
        displayType: 'http://lblod.data.gift/display-types/conceptSelector',
        edit: ConceptSelector,
      },
    ]);
  }
}
