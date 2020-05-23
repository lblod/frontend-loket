import Component from '@glimmer/component';
import {inject as service} from '@ember/service';

export default class SharedBreadCrumbComponent extends Component {

  @service router;

  bread = [
    {
      route: 'toezicht.inzendingen.index',
      crumbs: [{label: 'Toezicht'}]
    },
    {
      route: 'toezicht.inzendingen.edit',
      crumbs: [{label: 'Toezicht',link: 'toezicht.inzendingen'},{label: 'Bekijk melding'}]
    },
    {
      route: 'toezicht.inzendingen.new',
      crumbs: [{label: 'Toezicht',link: 'toezicht.inzendingen'},{label: 'Nieuwe melding'}]
    },
    {
      route: 'supervision.submissions.index',
      crumbs: [{label: 'Toezicht'}]
    },
    {
      route: 'supervision.submissions.edit',
      crumbs: [{label: 'Toezicht',link: 'supervision.submissions'},{label: 'Bekijk melding'}]
    },
    {
      route: 'berichtencentrum.berichten.index',
      crumbs: [{label: 'Berichtencentrum'}]
    },
    {
      route: 'berichtencentrum.berichten.conversatie.index',
      crumbs: [{label: 'Berichtencentrum',link: 'toezicht.inzendingen'},{label: 'Dossier'}]
    },
    {
      route: 'bbcdr.rapporten.index',
      crumbs: [{label: 'BBCDR Beleids- en Beheercyclus'}]
    },
    {
      route: 'bbcdr.rapporten.edit',
      crumbs: [{label: 'BBCDR Beleids- en Beheercyclus',link: 'bbcdr.rapporten'},{label: 'Rapport'}]
    },
    {
      route: 'bbcdr.rapporten.new',
      crumbs: [{label: 'BBCDR Beleids- en Beheercyclus',link: 'bbcdr.rapporten'},{label: 'Nieuw rapport'}]
    },
    {
      route: 'mandatenbeheer.mandatarissen.index',
      crumbs: [{label: 'Mandatenbeheer'}]
    },
    {
      route: 'mandatenbeheer.mandatarissen.edit',
      crumbs: [{label: 'Mandatenbeheer',link: 'mandatenbeheer.mandatarissen'},{label: 'Bewerk'}]
    },
    {
      route: 'mandatenbeheer.mandatarissen.new',
      crumbs: [{label: 'Mandatenbeheer',link: 'mandatenbeheer.mandatarissen'},{label: 'Voeg mandaat toe'}]
    },
    {
      route: 'mandatenbeheer.mandatarissen.new-person',
      crumbs: [{label: 'Mandatenbeheer',link: 'mandatenbeheer.mandatarissen'},{label: 'Voeg nieuwe persoon toe'}]
    },
    {
      route: 'mandatenbeheer.fracties.index',
      crumbs: [{label: 'Mandatenbeheer',link: 'mandatenbeheer.mandatarissen'},{label: 'Beheer fracties'}]
    },
    {
      route: 'leidinggevendenbeheer.bestuursfuncties.index',
      crumbs: [{label: 'Leidinggevendenbeheer'}]
    },
    {
      route: 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index',
      crumbs: [{label: 'Leidinggevendenbeheer',link: 'leidinggevendenbeheer.bestuursfuncties'},{label: 'Functionaris'}]
    },
    {
      route: 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.edit',
      crumbs: [{label: 'Leidinggevendenbeheer',link: 'leidinggevendenbeheer.bestuursfuncties'},{label: 'Bewerk functionaris'}]
    },
    {
      route: 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.index',
      crumbs: [{label: 'Leidinggevendenbeheer',link: 'leidinggevendenbeheer.bestuursfuncties'},{label: 'Nieuwe aanstellingsperiode'}]
    },
    {
      route: 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.contact-info',
      crumbs: [{label: 'Leidinggevendenbeheer',link: 'leidinggevendenbeheer.bestuursfuncties'},{label: 'Bewerk contactgegevens'}]
    },
    {
      route: 'personeelsbeheer.personeelsaantallen.index',
      crumbs: [{label: 'Personeelsbeheer'}]
    },
    {
      route: 'personeelsbeheer.personeelsaantallen.periodes.edit',
      crumbs: [{label: 'Personeelsbeheer',link: 'personeelsbeheer.personeelsaantallen.index'},{label: 'Bewerk aantallen'}]
    },
  ]

  get crumbsForRoute() {
    const results = this.bread.filter(value => value.route === this.router.currentRouteName );
    if(results.length <= 0) return [];
    return results[0].crumbs;
  }
}
