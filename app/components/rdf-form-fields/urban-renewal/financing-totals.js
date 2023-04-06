import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { Literal, Namespace } from 'rdflib';

const EXT = new Namespace('http://mu.semte.ch/vocabularies/ext/');
const PARTNER_TYPE = new Namespace(
  'http://lblod.data.gift/vocabularies/subsidie/concept/FinancieringPartnerType/'
);

export default class FinancingTotals extends Component {
  @tracked totals;
  id = guidFor(this);

  formatAmount = (amount) => {
    return new Intl.NumberFormat('nl-BE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  formatPercentage = (percentage) => {
    return new Intl.NumberFormat('nl-BE', {
      style: 'percent',
      maximumFractionDigits: 2,
    }).format(percentage);
  };

  calculatePercentage = (amount, total) => {
    if (total === 0) {
      return 0;
    }

    return amount / total;
  };

  constructor() {
    super(...arguments);

    this.calculateTotals();

    this.args.formStore.registerObserver(() => {
      // This will potentially run a lot of times. We can probably check the delta and see if the change affects this component, but due to time constraints we're skipping that for now.
      // It's also possible that the delta checking is more intensive than the actual computations, but that would have to be benchmarked.
      this.calculateTotals();
    }, this.id);
  }

  calculateTotals() {
    const { formStore, graphs, sourceNode } = this.args;

    const financingPartners = formStore
      .match(sourceNode, EXT('financingPartner', undefined, graphs))
      .reduce((financingPartners, triple) => {
        const partner = {
          node: triple.object,
        };
        const partnerType = formStore.any(
          partner.node,
          EXT('partnerType'),
          undefined,
          graphs.sourceGraph
        );

        if (partnerType) {
          partner.type = partnerType;
          const financingAmountLiteral = formStore.any(
            partner.node,
            EXT('financingAmount'),
            undefined,
            graphs.sourceGraph
          );

          partner.amount = financingAmountLiteral
            ? Literal.toJS(financingAmountLiteral)
            : 0;

          financingPartners.push(partner);
        }

        return financingPartners;
      }, []);

    const totals = new Totals();

    financingPartners.forEach((partner) => {
      if (partner.type.equals(PARTNER_TYPE('EigenAandeel'))) {
        totals.own += partner.amount;
      } else if (partner.type.equals(PARTNER_TYPE('Privaat'))) {
        totals.private += partner.amount;
      } else if (partner.type.equals(PARTNER_TYPE('Publiek'))) {
        totals.public += partner.amount;
      }
    });

    this.totals = totals;
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.args.formStore.deregisterObserver(this.id);
  }
}

class Totals {
  own = 0;
  private = 0;
  public = 0;

  get total() {
    return this.own + this.private + this.public;
  }
}
