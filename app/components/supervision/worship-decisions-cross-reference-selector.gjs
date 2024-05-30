import Component from '@glimmer/component';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuTable from '@appuniversum/ember-appuniversum/components/au-table';
import { AddIcon } from '@appuniversum/ember-appuniversum/components/icons/add';
import { BinIcon } from '@appuniversum/ember-appuniversum/components/icons/bin';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import PowerSelect from 'ember-power-select/components/power-select';
import {
  RDF,
  SKOS,
  triplesForPath,
  updateSimpleFormValue,
} from '@lblod/submission-form-helpers';
import { Literal, NamedNode, parse, Store } from 'rdflib';
import { BESLUIT, ELI, EXT } from 'frontend-loket/rdf/namespaces';
import { v4 as uuid } from 'uuid';

const articlePredicate = ELI('has_part');

class Article {
  @tracked type;
  @tracked decisions = [];
  sourceNode;

  // constructor(articleNode) {
  // }

  addDecisions(decisions) {
    this.decisions = [...this.decisions, decisions];
  }

  removeDecisionss(decisions) {
    this.decisions;
  }
}

export default class DecisionArticlesField extends Component {
  @tracked showModal = false;
  @tracked articles = [];

  constructor() {
    super(...arguments);

    this.loadArticles();
  }

  get hasErrors() {
    // TODO
    return false;
  }

  get hasWarnings() {
    // TODO
    return false;
  }

  get isRequired() {
    // TODO
    return true;
  }

  get decisionType() {
    return this.args.formStore.any(
      this.args.sourceNode,
      RDF('type'),
      undefined,
      this.args.graphs.sourceGraph,
    );
  }

  loadArticles = () => {
    // TODO: load the data from the forking store
    // <decision> a <<https://data.vlaanderen.be/id/concept/BesluitType/79414af4-4f57-4ca3-aaa4-f8f1e015e71c>>.
    // # Note <decision> will be your 'starting'-uri, as usual in the forms

    // # The CRUD'ing happens on the following set of triples.
    // <decision> eli:has_part <artikel>.
    // <artikel> a besluit:Artikel;
    //   <<http://data.europa.eu/eli/ontology#type_document>> <Verwerping gerefereerde documenten>; # See definition of ConceptScheme, later in the text.
    //   <<http://data.europa.eu/eli/ontology#refers_to>> <cross-referenced-decision-1>, <cross-referenced-decision-2>.

    const store = this.args.formStore;
    const triples = store.match(
      this.args.sourceNode,
      articlePredicate,
      undefined,
      this.args.graphs.sourceGraph,
    );

    this.articles = triples.map(triple => triple.object);
    // TODO, fetch the needed data for each article, type, linked decisions,..
  };

  createArticle = () => {
    const article = articleNode();
    this.articles = [
      ...this.articles,
      // TODO; use a wrapper class with tracked state instead
      article
    ];

    const sourceGraph = this.args.graphs.sourceGraph;

    const triples = [
      {
        subject: article,
        predicate: RDF('type'),
        object: BESLUIT('Artikel'),
        graph: sourceGraph,
      },
      {
        subject: this.args.sourceNode,
        predicate: articlePredicate,
        object: article,
        graph: sourceGraph,
      },
    ];
    this.args.formStore.addAll(triples);
  };

  removeArticle = (articleToRemove) => {
    this.articles = this.articles.filter(
      (article) => article !== articleToRemove,
    );

    const sourceGraph = this.args.graphs.sourceGraph;
    const triples = [
      {
        subject: this.args.sourceNode,
        predicate: articlePredicate,
        object: articleToRemove, // TODO, should be the node
        graph: sourceGraph,
      },
      ...this.args.formStore.match(articleToRemove, undefined, undefined, sourceGraph),
    ];
    this.args.formStore.removeStatements(triples);
  };

  <template>
    <AuLabel
      @error={{this.hasErrors}}
      @required={{this.isRequired}}
      @warning={{this.hasWarnings}}
      for={{this.inputId}}
    >
      {{@field.label}}
    </AuLabel>

    {{#if this.articles}}
      <ul class="au-o-flow au-o-flow--small">
        {{#each this.articles as |article index|}}
          <li>
            <ArticleDetails
              @article={{article}}
              @count={{plusOne index}}
              @show={{@show}}
              @onRemove={{fn this.removeArticle article}}
              @formStore={{@formStore}}
              @metaGraph={{@graphs.metaGraph}}
              @decisionType={{this.decisionType}}
            />
          </li>
        {{/each}}
      </ul>
    {{else}}
      <div class="au-u-text-center">
        Geen artikels
      </div>
    {{/if}}

    <div class="au-u-text-center">
      <AuButton @icon={{AddIcon}} {{on "click" this.createArticle}}>
        Voeg artikel toe
      </AuButton>
    </div>
  </template>
}

class ArticleDetails extends Component {
  @tracked type;
  @tracked showModal = false;

  addDecisions = () => {
    // Add the selected decisions to the list and store
  };

  <template>
    <div class="article-details" ...attributes>
      Artikel
      {{@count}}
      <AuButton
        @icon={{BinIcon}}
        @hideText={{true}}
        @alert={{true}}
        {{on "click" @onRemove}}
      >Artikel verwijderen</AuButton>

      <ConceptSchemeSelect
        @formStore={{@formStore}}
        @metaGraph={{@metaGraph}}
        @conceptScheme="http://data.lblod.info/concept-schemes/aeb364c6-768a-4a6b-8cbf-a681d1a6b8b6"
        {{! ArticleTypes }}
        @selected={{this.type}}
        @onChange={{fn (mut this.type)}}
      >
        <:label>Type referentie</:label>
      </ConceptSchemeSelect>

      <AuTable>
        <:title>Besluiten</:title>
        <:header>
          <tr>
            <th>Naam</th>
            <th>Datum</th>
            <th>Bestuur van de eredienst</th>
            <th></th>
          </tr>
        </:header>
        <:body>
          {{#each this.decisions as |decision|}}
            <tr>
              <td>{{decision.name}}</td>
              <td>{{decision.sentBy}}</td>
              <td>{{decision.sentDate}}</td>
              <td>
                {{! TODO: implement removal }}
                <AuButton
                  @skin="naked"
                  @alert={{true}}
                  @hideText={{true}}
                  @icon={{BinIcon}}
                >
                  Verwijder
                </AuButton>
              </td>
            </tr>
          {{else}}
            <tr>
              <td colspan="4">Geen besluiten</td>
            </tr>
          {{/each}}
        </:body>
        <:footer>
          <tr>
            <td colspan="4">
              <AuButton
                @skin="secondary"
                @icon={{AddIcon}}
                {{on "click" (fn (mut this.showModal) true)}}
              >
                Voeg besluiten toe
              </AuButton>
            </td>
          </tr>
        </:footer>
      </AuTable>

      {{#if this.showModal}}
        <Modal
          @decisionType={{@decisionType}}
          @formStore={{@formStore}}
          @metaGraph={{@metaGraph}}
          @onClose={{fn (mut this.showModal)}}
          @onAdd={{this.addDecisions}}
        />
      {{/if}}
    </div>
  </template>
}

class Modal extends Component {
  @tracked type;
  @tracked org;
  @tracked searchResults = [];

  search = async () => {
    // TODO: check if the "org" is set before
    const url = new URL(
      '/related-document-information',
      window.location.origin,
    );
    url.searchParams.append('forDecisionType', this.args.decisionType.uri);
    url.searchParams.append('forEenheid', this.org.uri);
    const response = await fetch(url);

    if (response.ok) {
      const ttlData = await response.text();

      if (ttlData.length > 0) {
        // TODO; put data in rdflib graph, convert the data to an array of objects
        const store = new Store();
        const graph = new NamedNode('http://this-seems-needed');
        parse(ttlData, store, graph.uri);

        console.log(store);
        const submissions = store.match(
          null,
          RDF('type'),
          EXT('SubmissionDocument'),
          graph,
        );
        let data = submissions.map((submission) => {
          const subject = submission.subject;
          const prefLabel = store.any(
            subject,
            SKOS('prefLabel'),
            undefined,
            graph,
          );
          const sentDate = store.any(
            subject,
            new NamedNode(
              'http://www.semanticdesktop.org/ontologies/2007/03/22/nmo#sentDate',
            ),
            undefined,
            graph,
          );
          return {
            uri: subject.uri,
            label: prefLabel.value,
            sentDate: Literal.toJS(sentDate),
          };
        });

        data.sort((a, b) => b.sentDate - a.sentDate);

        this.searchResults = data;

        // for (const submission of data) {
        //   const url = new URL('/related-document-information', window.location.origin);
        //   url.searchParams.append('forRelatedDecision', submission.uri);

        //   const response = await fetch(url);
        // }

        console.log(data);
        return data;
      } else {
        // no results
      }
    }
  };

  <template>
    <AuModal
      @modalOpen={{true}}
      @closeModal={{@onClose}}
      {{! @size="large" }}
      @overflow={{true}}
    >
      <:title>Besluiten zoeken</:title>
      <:body>
        <ConceptSchemeSelect
          @formStore={{@formStore}}
          @metaGraph={{@metaGraph}}
          {{! // TODO: there are 2 different "betreffende bestuur van de eredienst" fields in the form and both have a different concept scheme, so this might need to be adjustable if this is correct }}
          @conceptScheme="http://lblod.data.gift/concept-schemes/2e136902-f709-4bf7-a54a-9fc820cf9f07"
          {{! bestuurseenheden }}
          {{!-- @conceptScheme="http://lblod.data.gift/concept-schemes/164a27d5-cf7e-43ea-996b-21645c02a920" {{! bestuurseenheden }} --}}
          @selected={{this.org}}
          @onChange={{fn (mut this.org)}}
        >
          <:label>Bestuur van de eredienst</:label>
        </ConceptSchemeSelect>

        <AuButton {{on "click" this.search}}>Besluiten zoeken</AuButton>

        <div>
          <table>
            <tr>
              <th></th>
              <th>URI</th>
              <th>Naam</th>
              <th>Datum</th>
            </tr>
            {{#each this.searchResults as |submission|}}
              <tr>
                <td>Checkbox</td>
                <td>{{submission.uri}}</td>
                <td>{{submission.label}}</td>
                <td>{{submission.sentDate}}</td>
              </tr>
            {{/each}}
          </table>
        </div>
      </:body>
      <:footer>
        <AuButton>Action</AuButton>
      </:footer>
    </AuModal>
  </template>
}

class ConceptSchemeSelect extends Component {
  @tracked options = this.getOptions();

  getOptions() {
    const metaGraph = this.args.metaGraph;
    const conceptSchemeUri = this.args.conceptScheme;
    const conceptScheme = new NamedNode(conceptSchemeUri);

    const options = this.args.formStore
      .match(undefined, SKOS('inScheme'), conceptScheme, metaGraph)
      .map((t) => {
        const label = this.args.formStore.any(
          t.subject,
          SKOS('prefLabel'),
          undefined,
          metaGraph,
        );
        return { subject: t.subject, label: label?.value };
      });

    options.sort(byLabel);

    return options;
  }

  get selected() {
    if (!this.args.selected) {
      return null;
    }

    return this.options.find((option) =>
      option.subject.equals(this.args.selected),
    );
  }

  handleChange = (option) => {
    this.args.onChange?.(option.subject);
  };

  <template>
    <AuLabel>{{yield to="label"}}</AuLabel>
    <PowerSelect
      @options={{this.options}}
      @selected={{this.selected}}
      @onChange={{this.handleChange}}
      {{!-- @renderInPlace={{true}} --}}
      as |concept|
    >
      {{concept.label}}
    </PowerSelect>
  </template>
}

function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
}

function plusOne(number) {
  return number + 1;
}

function articleNode() {
  // TODO, double check if this base url is fine
  return new NamedNode(`http://data.lblod.info/decision-article/${uuid()}`);
}
