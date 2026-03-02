import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import AuTooltip from '@appuniversum/ember-appuniversum/components/au-tooltip';
import AuBadge from '@appuniversum/ember-appuniversum/components/au-badge';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import eq from 'ember-truth-helpers/helpers/eq';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { downloadZip } from 'client-zip';
import { v4 as uuidv4 } from 'uuid';

import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { registerFormFields } from '@lblod/ember-submission-form-fields';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';
import { RDF, NIE } from '@lblod/submission-form-helpers';
import { NamedNode, Namespace } from 'rdflib';
import {
  triplesForPath,
  validationResultsForFieldPart,
  addSimpleFormValue,
  removeSimpleFormValue,
} from '@lblod/submission-form-helpers';

import { triggerZipDownload } from '../../../utils/zip-download';
import { downloadSuccess, downloadLink } from '../../../utils/remoteDataObject';
import { humanReadableSize, extensionFormatted, filenameWithoutExtension } from '../../../utils/file';
import { autofocus } from '../../../modifiers/auto-focus';

export function registerFormField() {
  registerFormFields([
    {
      displayType: 'http://lblod.data.gift/display-types/remoteUrls',
      edit: DecisionRemoteDocumentsEditAltComponent,
      show: DecisionRemoteDocumentsShowComponent,
    },
    {
      displayType: 'http://lblod.data.gift/display-types/remoteUrls/variation/1',
      edit: DecisionRemoteDocumentsEditComponent,
      show: DecisionRemoteDocumentsShowComponent,
    },
  ]);
}

const REMOTE_URI_TEMPLATE = 'http://data.lblod.info/remote-data-object/';
const REQUEST_HEADER = new NamedNode(
  'http://data.lblod.info/request-headers/29b14d06-e584-45d6-828a-ce1f0c018a8e',
);
const RPIO_HTTP = new Namespace(
  'http://redpencil.data.gift/vocabularies/http/',
);
const MU = new Namespace('http://mu.semte.ch/vocabularies/core/');

class RemoteDataObject {
  uuid;
  uri;
  @tracked source;
  @tracked errors;

  constructor(uuid, uri, source, errors) {
    this.uuid = uuid;
    this.uri = uri;
    this.source = source;
    this.errors = errors;
  }

  get isValid() {
    return this.errors.length == 0;
  }

  get isInvalid() {
    return !this.isValid;
  }
}

const DecisionRemoteDocumentsEditAltComponent = <template>
  <DecisionRemoteDocumentsEditComponent
    @field={{@field}}
    @form={{@form}}
    @formStore={{@formStore}}
    @graphs={{@graphs}}
    @sourceNode={{@sourceNode}}
    @forceShowErrors={{@forceShowErrors}}
    @cacheConditionals={{@cacheConditionals}}
    @show={{@show}}
    {{! TODO: The requiredLabel argument is the only reason why this custom component is needed.
      Should we make the form config more flexible so extra data can be passed? }}
    @requiredLabel="Voorkeur"
  />
</template>

export class DecisionRemoteDocumentsEditComponent extends InputFieldComponent {
  inputId = `remote-data-object-${guidFor(this)}`;
  @tracked remoteDataObjects = [];
  @tracked remoteDataObjectToFocus = null;
  // Could have used uuidv4, but more consistent accross components
  observerLabel = `remote-data-object-${guidFor(this)}`;

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
    this.args.formStore.registerObserver(
      this.onStoreUpdate.bind(this),
      this.observerLabel,
    );
  }

  willDestroy() {
    this.storeOptions.store.deregisterObserver(this.observerLabel);
  }

  // The validation of this fields depends on the value of other fields,
  // hence we recalculate the validation on notification of a change in the store
  onStoreUpdate() {
    super.updateValidations();
  }

  get inputFor() {
    if (this.remoteDataObjects.length) {
      return `${this.inputId}-${this.remoteDataObjects.length - 1}`;
    }
    return this.inputId;
  }

  get hasInvalidRemoteDataObject() {
    return this.remoteDataObjects.some((url) => url.isInvalid);
  }

  async loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const persistedRDOs = [];

    for (let uri of matches.values) {
      if (this.isRemoteDataObject(uri)) {
        const remoteUrl = await this.retrieveRemoteDataObject(uri);
        persistedRDOs.push(remoteUrl);
      }
    }

    this.remoteDataObjects = persistedRDOs;
  }

  isRemoteDataObject(subject) {
    const remoteDataObjectType = new NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject',
    );
    return (
      this.storeOptions.store.match(
        subject,
        RDF('type'),
        remoteDataObjectType,
        this.storeOptions.sourceGraph,
      ).length > 0
    );
  }

  async retrieveRemoteDataObject(uri) {
    const rdoTriples = this.storeOptions.store.match(
      uri,
      NIE('url'),
      undefined,
      this.storeOptions.sourceGraph,
    );

    if (rdoTriples.length) {
      const address = rdoTriples[0].object.value;
      const errors = await this.validationErrorMessagesForAddress(address);

      if (rdoTriples.length > 1)
        errors.push('Veld kan maximaal 1 URL bevatten');

      return new RemoteDataObject(undefined, uri, address, errors);
    } else {
      return new RemoteDataObject(
        undefined,
        uri,
        undefined,
        ['Dit veld is verplicht'],
      );
    }
  }

  removeRemoteDataObject(uri) {
    const remoteObjecTs = this.storeOptions.store.match(
      uri,
      undefined,
      undefined,
      this.storeOptions.sourceGraph,
    );
    if (remoteObjecTs.length) {
      this.storeOptions.store.removeStatements(remoteObjecTs);
    }
    // remove hasPart
    removeSimpleFormValue(new NamedNode(uri), this.storeOptions);
  }

  insertRemoteDataObject(uuid, uri, address) {
    const triples = [
      {
        subject: uri,
        predicate: RDF('type'),
        object: new NamedNode(
          'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject',
        ),
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: uri,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: uri,
        predicate: NIE('url'),
        object: address,
        graph: this.storeOptions.sourceGraph,
      },
      // Add request-header(s)
      {
        subject: uri,
        predicate: RPIO_HTTP('requestHeader'),
        object: REQUEST_HEADER,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
    addSimpleFormValue(uri, this.storeOptions); // add hasPart;
  }

  @action
  addRemoteDataObjectField() {
    const uuid = uuidv4();
    const rdo = new RemoteDataObject(
      uuid,
      new NamedNode(REMOTE_URI_TEMPLATE + `${uuid}`),
      '',
      [],
    );

    this.remoteDataObjectToFocus = rdo;
    // Not simply a .push() because the array is tracked so it needs to be set
    // to something new for changes to take effect.
    this.remoteDataObjects = this.remoteDataObjects.concat([rdo]);
  }

  @action
  async updateRemoteDataObject(rdo, event) {
    rdo.source = event.target.value.trim();
    this.removeRemoteDataObject(rdo.uri);
    this.insertRemoteDataObject(
      rdo.uuid,
      rdo.uri,
      rdo.source,
    );
    this.hasBeenFocused = true;
    // update validations specific for the address
    // general validation of the field is handled by onStoreUpdate()
    rdo.errors = await this.validationErrorMessagesForAddress(rdo.source);
  }

  @action
  removeRemoteDataObjectField(remoteDataObjectToRemove) {
    this.removeRemoteDataObject(remoteDataObjectToRemove.uri);
    this.remoteDataObjects = this.remoteDataObjects.filter(
      (rdo) => rdo !== remoteDataObjectToRemove,
    );
    this.hasBeenFocused = true;
    // general validation of the field is handled by onStoreUpdate()
  }

  async validationErrorMessagesForAddress(address) {
    const validationResults = await validationResultsForFieldPart(
      { values: [{ value: address }] },
      this.args.field.uri,
      this.storeOptions,
    );

    return validationResults
      .filter((r) => !r.valid)
      .map((e) => e.resultMessage);
  }

  <template>
    <AuLabel
      @error={{this.hasErrors}}
      @required={{this.isRequired}}
      @requiredLabel={{@requiredLabel}}
      @warning={{this.hasWarnings}}
      for={{this.inputFor}}
      class={{if @field.help "au-u-margin-bottom-none"}}
    >
      {{@field.label}}
    </AuLabel>
    <HelpText @field={{@field}} />

    {{#if this.remoteDataObjects}}
      <ul class="au-o-flow au-o-flow--tiny">
        {{#each this.remoteDataObjects as |rdo index|}}
          <li class="au-c-card au-o-box au-o-box--small">
            <AuInput
              @error={{rdo.isInvalid}}
              @width="block"
              value={{rdo.source}}
              id="{{this.inputId}}-{{index}}"
              placeholder="http://www.uw-bestuur.be/specifiek-document"
              {{on "blur" (fn this.updateRemoteDataObject rdo)}}
              {{(if
                (eq rdo this.remoteDataObjectToFocus) (modifier autofocus)
              )}}
            />
            {{#if rdo.isInvalid}}
              {{#each rdo.errors as |error|}}
                <AuHelpText @error="error">{{error}}</AuHelpText>
              {{/each}}
            {{/if}}
            <div class="au-u-margin-top-tiny">
              {{#if rdo.source}}
                <AuLinkExternal
                  @icon="external-link"
                  @iconAlignment="left"
                  href={{rdo.source}}
                >
                  Test&nbsp;link
                </AuLinkExternal>
              {{/if}}
              <AuButton
                @skin="link"
                @icon="bin"
                @iconAlignment="left"
                {{!template-lint-disable no-pointer-down-event-binding}}
                {{!
                  We use the mousedown event because it is triggered before the `blur` event of the input element.
                  This is needed because the blur event displays validation messages if the input is empty which displace the button
                  and as a result, the click event wouldn't be triggered.
                }}
                {{on "mousedown" (fn this.removeRemoteDataObjectField rdo)}}
              >
                Verwijder&nbsp;link
              </AuButton>
            </div>
          </li>
        {{/each}}
      </ul>
    {{/if}}

    <div class="au-u-margin-top au-u-text-center">
      {{#unless this.remoteDataObjects}}
        <AuHelpText class="au-u-margin-bottom-tiny au-u-margin-bottom-top">
          Nog geen links toegevoegd.
        </AuHelpText>
      {{/unless}}
      <AuButton
        @icon="plus"
        @iconAlignment="left"
        id={{this.inputId}}
        class="au-u-margin-bottom-tiny"
        {{on "click" this.addRemoteDataObjectField}}
      >
        Voeg nieuwe link toe
      </AuButton>
      <div class="au-u-margin-bottom-tiny au-u-margin-top-tiny">
        <AuHelpText>Enkel links naar specifieke documenten, geen overzichtspagina's.</AuHelpText>
      </div>
    </div>

    {{#unless this.hasInvalidRemoteDataObject}}
      {{#each this.errors as |error|}}
        <AuHelpText @error={{true}}>{{error.resultMessage}}</AuHelpText>
      {{/each}}

      {{#each this.warnings as |warning|}}
        <AuHelpText @warning={{true}}>{{warning.resultMessage}}</AuHelpText>
      {{/each}}
    {{/unless}}
  </template>
}

export default class DecisionRemoteDocumentsShowComponent extends Component {
  @service store;
  @service toaster;

  @tracked remoteDataObjects;
  @tracked sourceDocumentUrls;
  @tracked attachmentUrls;
  @tracked hasRemoteUrlErrors = false;

  constructor() {
    super(...arguments);
    this.loadRemoteUrls.perform();
  }

  get storeOptions() {
    return {
      formGraph: this.args.graphs.formGraph,
      sourceGraph: this.args.graphs.sourceGraph,
      metaGraph: this.args.graphs.metaGraph,
      sourceNode: this.args.sourceNode,
      store: this.args.formStore,
      path: this.args.field.rdflibPath,
      scope: this.args.field.rdflibScope,
    };
  }

  get canDownloadZip() {
    if (this.loadRemoteUrls.isRunning) {
      return false;
    }

    return this.downloadableRemoteUrls.length > 1;
  }

  get downloadableRemoteUrls() {
    return this.remoteDataObjects.filter(downloadSuccess);
  }

  loadRemoteUrls = task(async () => {
    const matches = triplesForPath(this.storeOptions);
    const remoteDataObjects = [];
    const sourceDocumentUrls = [];
    const attachmentUrls = [];

    for (let uri of matches.values) {
      try {
        if (this.isRemoteDataObject(uri)) {
          const record = await this.loadRemoteDataObjectRecord(uri);
          remoteDataObjects.push(record);
        }
      } catch (error) {
        console.error(error);
        this.hasRemoteUrlErrors = true;
      }
    }

    // Filter the remote data objects by their creator. There are 3 ways a
    // remote data object is linked to a submission:
    // The automatic-submission-service downloads the source document for an
    // automatic submission (= sent it by an external party).
    // The validate-submission-service links the uploaded files to a submission
    // when it is created in Loket.
    // The import-submission-service is responsible for creating attachments to
    // automatic submissions when they are being processed.
    for (const rdo of remoteDataObjects) {
      const creator = rdo.creator;
      switch (creator) {
        case 'http://lblod.data.gift/services/import-submission-service':
          attachmentUrls.push(rdo);
          break;
        case 'http://lblod.data.gift/services/automatic-submission-service':
        case 'http://lblod.data.gift/services/validate-submission-service':
        default:
          sourceDocumentUrls.push(rdo);
          break;
      }
    }

    this.remoteDataObjects = remoteDataObjects;
    this.sourceDocumentUrls = sourceDocumentUrls;
    this.attachmentUrls = attachmentUrls;
  });

  isRemoteDataObject(subject) {
    const remoteDataObjectType = new NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject',
    );
    return (
      this.args.formStore.match(
        subject,
        RDF('type'),
        remoteDataObjectType,
        this.args.sourceGraph,
      ).length > 0
    );
  }

  async loadRemoteDataObjectRecord(remoteObjectUri) {
    const remoteDataObjects = await this.store.query('remote-data-object', {
      'filter[:uri:]': remoteObjectUri.value,
      page: { size: 1 },
      include: 'file',
    });
    if (remoteDataObjects.length) {
      return remoteDataObjects[0];
    } else {
      throw `No remote-data-object could be found for ${remoteObjectUri}`;
    }
  }

  downloadAsZip = task(async () => {
    const promises = this.downloadableRemoteUrls.map((rdo) => {
      return fetch(rdo.downloadLink).then((response) => {
        if (!response.ok) {
          throw new Error(
            `Something went wrong while trying to download '${rdo.downloadLink}': ${response.status} ${response.statusText}`,
          );
        }

        return response;
      });
    });

    try {
      const files = await Promise.all(promises);
      const zipBlob = await downloadZip(files).blob();
      triggerZipDownload(zipBlob, 'gebundelde-links.zip');
    } catch (error) {
      console.error(error);
      this.toaster.error(
        'Het .zip bestand kon niet gegenereerd worden. Probeer later opnieuw.',
      );
    }
  });

  <template>
    <div class="au-u-flex au-u-flex--between">
      <AuLabel class="au-u-margin-bottom-none">
        {{@field.label}}
        <AuTooltip @placement="right" as |tooltip|>
          <AuBadge
            {{tooltip.target}}
            @skin="border"
            @icon="question-circle"
            @size="small"
            class="au-u-margin-left-small"
          >
          </AuBadge>
          <tooltip.Content>
            Bij het indienen wordt er een kopie van het document in de link
            gegenereerd en opgeslagen.
          </tooltip.Content>
        </AuTooltip>
      </AuLabel>

      {{#if this.canDownloadZip}}
        <AuButton
          @skin="primary"
          @icon="download"
          @loading={{this.downloadAsZip.isRunning}}
          @loadingMessage=".zip aan het genereren"
          {{on "click" this.downloadAsZip.perform}}
        >
          Download alle links als .zip
        </AuButton>
      {{/if}}
    </div>

    {{#if this.loadRemoteUrls.isIdle}}
      {{#if this.remoteDataObjects}}
        {{#if this.sourceDocumentUrls}}
          <AuHelpText
            @skin="secondary"
            @size="large"
            class="au-u-bold au-u-margin-bottom-small au-u-margin-top-small"
          >
            Brondocumenten
          </AuHelpText>
          <ul class="au-o-flow au-o-flow--tiny">
            {{#each this.sourceDocumentUrls as |rdo|}}
              <RemoteDataObjectInfoCard
                @remoteDataObject={{rdo}}
              ></RemoteDataObjectInfoCard>
            {{/each}}
          </ul>
        {{/if}}
        {{#if this.attachmentUrls}}
          <AuHelpText
            @skin="secondary"
            @size="large"
            class="au-u-bold au-u-margin-bottom-small au-u-margin-top-small"
          >
            Bijlagen
          </AuHelpText>
          <ul class="au-o-flow au-o-flow--tiny">
            {{#each this.attachmentUrls as |rdo|}}
              <RemoteDataObjectInfoCard
                @remoteDataObject={{rdo}}
              ></RemoteDataObjectInfoCard>
            {{/each}}
          </ul>
        {{/if}}
      {{else}}
        {{#if this.hasRemoteUrlErrors}}
          <AuAlert @skin="error" @icon="info-circle" @size="small">
            Er ging iets fout bij het ophalen van de adressen.
          </AuAlert>
        {{else}}
          <AuHelpText class="au-u-margin-bottom-tiny">
            Er werden geen links toegevoegd.
          </AuHelpText>
        {{/if}}
      {{/if}}
    {{else}}
      <AuLoader @centered={{false}} @hideMessage={{true}}>Links aan het laden</AuLoader>
    {{/if}}
  </template>
}

const RemoteDataObjectInfoCard =
  <template>
    <li class="remote-data-object-list-card au-o-box au-o-box--small">
      <div class="au-u-flex au-u-flex--between">
        {{#if (downloadSuccess @remoteDataObject)}}
          <div>
            <AuLabel>
              {{filenameWithoutExtension @remoteDataObject.file}}
              <AuTooltip @placement="right" as |tooltip|>
                <AuBadge
                  {{tooltip.target}}
                  @skin="border"
                  @icon="question-circle"
                  @size="small"
                  class="au-u-margin-left-small"
                >
                </AuBadge>
                <tooltip.Content>
                  De bestandsnaam kan onduidelijk zijn. In sommige gevallen is de
                  originele naam niet beschikbaar.
                </tooltip.Content>
              </AuTooltip>
            </AuLabel>
            <div class="au-u-margin-bottom-small">
              <AuPill
                @icon="file"
                class="au-u-margin-right-tiny"
              >
                {{extensionFormatted @remoteDataObject.file}}
              </AuPill>
              {{humanReadableSize @remoteDataObject.file}}
            </div>
            <AuLinkExternal
              @icon="external-link"
              href={{@remoteDataObject.source}}
            >
              {{@remoteDataObject.source}}
            </AuLinkExternal>
          </div>
          <div>
            <AuLinkExternal
              @icon="download"
              @skin="button"
              href={{this.downloadLink @remoteDataObject}}
              class="au-u-margin-left-small"
              download
            >
              Download
            </AuLinkExternal>
          </div>
        {{else}}
          <div>
            <AuLabel
              @error={{true}}
            >
              Bestand onbeschikbaar
              <AuTooltip @placement="right" as |tooltip|>
                <AuBadge
                  {{tooltip.target}}
                  @skin="border"
                  @icon="question-circle"
                  @size="small"
                  class="au-u-margin-left-small"
                >
                </AuBadge>
                <tooltip.Content>
                  Het bestand kon niet worden gedownload bij de inzending. Probeer
                  het via de onderstaande link.
                </tooltip.Content>
              </AuTooltip>
            </AuLabel>
            <AuLinkExternal
              @icon="external-link"
              href={{@remoteDataObject.source}}
            >
              {{@remoteDataObject.source}}
            </AuLinkExternal>
          </div>
          <div>
            {{#if (downloadSuccess @remoteDataObject)}}
              <AuLinkExternal
                @icon="download"
                @skin="button"
                href={{downloadLink @remoteDataObject}}
                class="au-u-margin-left-small"
                download
              >
                Download
              </AuLinkExternal>
            {{/if}}
          </div>
        {{/if}}
      </div>
    </li>
  </template>
