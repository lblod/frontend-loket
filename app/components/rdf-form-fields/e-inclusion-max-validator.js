import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { NamedNode } from 'rdflib';
import { LBLOD_SUBSIDIE } from 'frontend-loket/rdf/namespaces';

const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const amountPredicate = new NamedNode(`${lblodSubsidieBaseUri}amount`);
const validAmountPredicate = new NamedNode(
  `${lblodSubsidieBaseUri}validatedAmount`
);

export default class RdfFormFieldsEInclusionMaxValidatorComponent extends SimpleInputFieldComponent {
  inputId = 'e-inclusion-max-validator' + guidFor(this);
  maximumvalue;
  @tracked errors = A();

  constructor() {
    super(...arguments);
    scheduleOnce('actions', this, this.initComponent);
  }

  initComponent() {
    const maxValue = this.args.formStore.match(
      undefined,
      LBLOD_SUBSIDIE('drawingRightEInclusion'),
      undefined,
      this.args.graphs.metaGraph
    )[0].object.value;

    this.maximumvalue = maxValue;
    this.validate();
  }

  updateTripleObject(subject, predicate, newObject = null) {
    const triples = this.storeOptions.store.match(
      subject,
      predicate,
      undefined,
      this.storeOptions.sourceGraph
    );

    this.storeOptions.store.removeStatements([...triples]);

    if (newObject) {
      this.storeOptions.store.addAll([
        {
          subject: subject,
          predicate: predicate,
          object: newObject,
          graph: this.storeOptions.sourceGraph,
        },
      ]);
    }
  }

  @action
  validate() {
    this.errors = A();
    const source = this.storeOptions.sourceNode;
    const num = Number(this.value);
    if (!this.isRealPositiveNumber(num)) {
      this.errors.pushObject({
        message: 'Geef een bedrag groter dan 0 in',
      });
      this.updateTripleObject(source, validAmountPredicate, null);
    } else if (!this.isValidEuroAmount(this.value)) {
      this.errors.pushObject({
        message: 'Geef een bedrag met maximaal 2 cijfers na de komma in',
      });
      this.updateTripleObject(source, validAmountPredicate, null);
    } else if (!this.isValidAmountLB(num)) {
      this.errors.pushObject({
        message:
          'Het aangevraagde bedrag overschrijdt de maximale waarde voor dit bestuur: €' +
          Math.round(this.maximumvalue),
      });
      this.updateTripleObject(source, validAmountPredicate, null);
    } else {
      this.updateTripleObject(source, validAmountPredicate, true);
    }
    console.log('Got Here');
    this.updateTripleObject(source, amountPredicate, num);
  }

  isRealPositiveNumber(value) {
    const num = Number(value);
    return num > 0;
  }

  isValidEuroAmount(value) {
    const split = value.toString().split('.')[1];
    if (split) {
      return split.length <= 2;
    }
    return true;
  }

  isValidAmountLB(value) {
    const num = Number(value);
    return num <= this.maximumvalue;
  }
}
