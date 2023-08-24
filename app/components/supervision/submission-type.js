import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { all, task, keepLatestTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

const CONCEPT_SCHEME_REGULATION_TYPE =
  'http://lblod.data.gift/concept-schemes/c93ccd41-aee7-488f-86d3-038de890d05a';
const CONCEPT_SCHEME_DECISION_TYPE =
  'https://data.vlaanderen.be/id/conceptscheme/BesluitType';
const CONCEPT_SCHEME_DOCUMENT_TYPE =
  'https://data.vlaanderen.be/id/conceptscheme/BesluitDocumentType';

export default class ToezichtSubmissionTypeComponent extends Component {
  @service store;

  @tracked decisionType;
  @tracked regulationType;

  @keepLatestTask
  *loadData() {
    const formData = yield this.args.formData;

    if (formData) {
      const concepts = yield formData.types;
      yield all(concepts.map((c) => this.updateSubmissionType.perform(c)));
    }
  }

  @task
  *updateSubmissionType(concept) {
    const topConceptSchemes = yield concept.topConceptSchemes;
    const topConceptSchemeUris = topConceptSchemes.map((cs) => cs.uri);
    const isTopConcept =
      topConceptSchemeUris.includes(CONCEPT_SCHEME_DECISION_TYPE) ||
      topConceptSchemeUris.includes(CONCEPT_SCHEME_DOCUMENT_TYPE);
    if (isTopConcept) this.decisionType = concept;

    const conceptSchemes = yield concept.conceptSchemes;
    const conceptSchemeUris = conceptSchemes.map((cs) => cs.uri);
    if (conceptSchemeUris.includes(CONCEPT_SCHEME_REGULATION_TYPE))
      this.regulationType = concept;
  }
}
