import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { registerFormFields } from '@lblod/ember-submission-form-fields';
import TagSelector from 'frontend-loket/components/public-services/rdf-form-fields/tag-selector';
import ConceptSelector from 'frontend-loket/components/rdf-form-fields/concept-selector';
import RichTextEditor from 'frontend-loket/components/rdf-form-fields/rich-text-editor';

export default class PublicServicesRoute extends Route {
  @service currentSession;
  @service session;
  @service router;

  constructor() {
    super(...arguments);

    this.registerCustomFormFields();
  }

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.canAccessPublicServices)
      this.router.transitionTo('index');
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
      {
        displayType: 'http://lblod.data.gift/display-types/tagSelector',
        edit: TagSelector,
      },
    ]);
  }
}
