import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import AuTooltip from '@appuniversum/ember-appuniversum/components/au-tooltip';
import AuBadge from '@appuniversum/ember-appuniversum/components/au-badge';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';

import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { task } from 'ember-concurrency';
import { downloadZip } from 'client-zip';

import { RDF } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';

import { triggerZipDownload } from '../../../utils/zip-download';
import { downloadSuccess, downloadLink } from '../../../helpers/remoteDataObject';
import { humanReadableSize, extensionFormatted, filenameWithoutExtension } from '../../../helpers/file';

import CustomRemoteUrlsEditComponent from '@lblod/ember-submission-form-fields/components/custom-submission-form-fields/remote-urls/edit';
import RemoteUrlsEditComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/remote-urls/edit';
import { registerFormFields } from '@lblod/ember-submission-form-fields';

export function registerFormField() {
  registerFormFields([
    {
      displayType: 'http://lblod.data.gift/display-types/remoteUrls',
      edit: CustomRemoteUrlsEditComponent,
      show: RemoteDataObjectShowComponent,
    },
    {
      displayType: 'http://lblod.data.gift/display-types/remoteUrls/variation/1',
      edit: RemoteUrlsEditComponent,
      show: RemoteDataObjectShowComponent,
    },
  ]);
}

export default class RemoteDataObjectShowComponent extends Component {
  @service store;
  @service toaster;

  @tracked remoteUrls;
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
    return this.remoteUrls.filter(downloadSuccess);
  }

  loadRemoteUrls = task(async () => {
    const matches = triplesForPath(this.storeOptions);
    const remoteUrls = [];
    const sourceDocumentUrls = [];
    const attachmentUrls = [];

    for (let uri of matches.values) {
      try {
        if (this.isRemoteDataObject(uri)) {
          const record = await this.loadRemoteDataObjectRecord(uri);
          remoteUrls.push(record);
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
    for (const remoteUrl of remoteUrls) {
      const creator = remoteUrl.creator;
      switch (creator) {
        case 'http://lblod.data.gift/services/import-submission-service':
          attachmentUrls.push(remoteUrl);
          break;
        case 'http://lblod.data.gift/services/automatic-submission-service':
        case 'http://lblod.data.gift/services/validate-submission-service':
        default:
          sourceDocumentUrls.push(remoteUrl);
          break;
      }
    }

    this.remoteUrls = remoteUrls;
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
    const remoteUrls = await this.store.query('remote-data-object', {
      'filter[:uri:]': remoteObjectUri.value,
      page: { size: 1 },
      include: 'file',
    });
    if (remoteUrls.length) {
      return remoteUrls[0];
    } else {
      throw `No remote-data-object could be found for ${remoteObjectUri}`;
    }
  }

  downloadAsZip = task(async () => {
    const promises = this.downloadableRemoteUrls.map((remoteUrl) => {
      return fetch(remoteUrl.downloadLink).then((response) => {
        if (!response.ok) {
          throw new Error(
            `Something went wrong while trying to download '${remoteUrl.downloadLink}': ${response.status} ${response.statusText}`,
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
      {{#if this.remoteUrls}}
        {{#if this.sourceDocumentUrls}}
          <AuHelpText
            @skin="secondary"
            @size="large"
            class="au-u-bold au-u-margin-bottom-small au-u-margin-top-small"
          >
            Brondocumenten
          </AuHelpText>
          <ul class="au-o-flow au-o-flow--tiny">
            {{#each this.sourceDocumentUrls as |remoteUrl|}}
              <RemoteDataObjectInfoCard
                @remoteDataObject={{remoteUrl}}
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
            {{#each this.attachmentUrls as |remoteUrl|}}
              <RemoteDataObjectInfoCard
                @remoteDataObject={{remoteUrl}}
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
    <li class="remote-url-list-card au-o-box au-o-box--small">
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
