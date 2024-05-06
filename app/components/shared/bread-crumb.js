import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SharedBreadCrumbComponent extends Component {
  @service router;

  bread = [
    {
      route: 'supervision.submissions.index',
      crumbs: [{ label: 'Toezicht' }],
    },
    {
      route: 'supervision.submissions.edit',
      crumbs: [
        { label: 'Toezicht', link: 'supervision.submissions' },
        { label: 'Bekijk melding' },
      ],
    },
    {
      route: 'berichtencentrum.berichten.index',
      crumbs: [{ label: 'Berichtencentrum' }],
    },
    {
      route: 'berichtencentrum.berichten.conversatie.index',
      crumbs: [
        { label: 'Berichtencentrum', link: 'berichtencentrum.berichten.index' },
        { label: 'Dossier' },
      ],
    },
    {
      route: 'bbcdr.rapporten.index',
      crumbs: [{ label: 'BBCDR Beleids- en Beheercyclus' }],
    },
    {
      route: 'bbcdr.rapporten.edit',
      crumbs: [
        { label: 'BBCDR Beleids- en Beheercyclus', link: 'bbcdr.rapporten' },
        { label: 'Rapport' },
      ],
    },
    {
      route: 'bbcdr.rapporten.new',
      crumbs: [
        { label: 'BBCDR Beleids- en Beheercyclus', link: 'bbcdr.rapporten' },
        { label: 'Nieuw rapport' },
      ],
    },
    {
      route: 'mandatenbeheer.mandatarissen.index',
      crumbs: [{ label: 'Mandatenbeheer' }],
    },
    {
      route: 'mandatenbeheer.mandatarissen.edit',
      crumbs: [
        { label: 'Mandatenbeheer', link: 'mandatenbeheer.mandatarissen' },
        { label: 'Bewerk' },
      ],
    },
    {
      route: 'mandatenbeheer.mandatarissen.new',
      crumbs: [
        { label: 'Mandatenbeheer', link: 'mandatenbeheer.mandatarissen' },
        { label: 'Voeg mandaat toe' },
      ],
    },
    {
      route: 'mandatenbeheer.mandatarissen.new-person',
      crumbs: [
        { label: 'Mandatenbeheer', link: 'mandatenbeheer.mandatarissen' },
        { label: 'Voeg nieuwe persoon toe' },
      ],
    },
    {
      route: 'mandatenbeheer.fracties.index',
      crumbs: [
        { label: 'Mandatenbeheer', link: 'mandatenbeheer.mandatarissen' },
        { label: 'Beheer fracties' },
      ],
    },
    {
      route: 'leidinggevendenbeheer.bestuursfuncties.index',
      crumbs: [{ label: 'Leidinggevendenbeheer' }],
    },
    {
      route:
        'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index',
      crumbs: [
        {
          label: 'Leidinggevendenbeheer',
          link: 'leidinggevendenbeheer.bestuursfuncties',
        },
        { label: 'Functionaris' },
      ],
    },
    {
      route:
        'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.edit',
      crumbs: [
        {
          label: 'Leidinggevendenbeheer',
          link: 'leidinggevendenbeheer.bestuursfuncties',
        },
        { label: 'Bewerk functionaris' },
      ],
    },
    {
      route:
        'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.index',
      crumbs: [
        {
          label: 'Leidinggevendenbeheer',
          link: 'leidinggevendenbeheer.bestuursfuncties',
        },
        { label: 'Nieuwe aanstellingsperiode' },
      ],
    },
    {
      route:
        'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.periode',
      crumbs: [
        {
          label: 'Leidinggevendenbeheer',
          link: 'leidinggevendenbeheer.bestuursfuncties',
        },
        { label: 'Nieuwe aanstellingsperiode' },
      ],
    },
    {
      route:
        'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new-person',
      crumbs: [
        {
          label: 'Leidinggevendenbeheer',
          link: 'leidinggevendenbeheer.bestuursfuncties',
        },
        { label: 'Voeg nieuwe persoon toe' },
      ],
    },
    {
      route:
        'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.contact-info',
      crumbs: [
        {
          label: 'Leidinggevendenbeheer',
          link: 'leidinggevendenbeheer.bestuursfuncties',
        },
        { label: 'Bewerk contactgegevens' },
      ],
    },
    {
      route: 'personeelsbeheer.personeelsaantallen.index',
      crumbs: [{ label: 'Personeelsbeheer' }],
    },
    {
      route: 'personeelsbeheer.personeelsaantallen.periodes.edit',
      crumbs: [
        {
          label: 'Personeelsbeheer',
          link: 'personeelsbeheer.personeelsaantallen.index',
        },
        { label: 'Bewerk aantallen' },
      ],
    },
    {
      route: 'subsidy.applications.index',
      crumbs: [{ label: 'Subsidiebeheer' }],
    },
    {
      route: 'subsidy.applications.available-subsidies',
      crumbs: [
        { label: 'Subsidiebeheer', link: 'subsidy.applications' },
        { label: 'Beschikbare subsidiemaatregelen' },
      ],
    },
    {
      route: 'subsidy.applications.edit',
      crumbs: [
        { label: 'Subsidiebeheer', link: 'subsidy.applications' },
        { label: 'Bekijk subsidieaanvraag' },
      ],
    },
    {
      route: 'subsidy.applications.edit.step',
      crumbs: [
        { label: 'Subsidiebeheer', link: 'subsidy.applications' },
        { label: 'Bekijk subsidieaanvraag' },
      ],
    },
    {
      route: 'subsidy.applications.edit.step.new_error',
      crumbs: [
        { label: 'Subsidiebeheer', link: 'subsidy.applications' },
        { label: 'Bekijk subsidieaanvraag' },
      ],
    },
    {
      route: 'subsidy.applications.edit.step.edit',
      crumbs: [
        { label: 'Subsidiebeheer', link: 'subsidy.applications' },
        { label: 'Bekijk subsidieaanvraag' },
      ],
    },
    {
      route: 'eredienst-mandatenbeheer.mandatarissen',
      crumbs: [{ label: 'Mandatenbeheer' }],
    },
    {
      route: 'eredienst-mandatenbeheer.mandataris.edit',
      crumbs: [
        {
          label: 'Mandatenbeheer',
          link: 'eredienst-mandatenbeheer.mandatarissen',
        },
        { label: 'Bewerk mandataris' },
      ],
    },
    {
      route: 'eredienst-mandatenbeheer.mandataris.details',
      crumbs: [
        {
          label: 'Mandatenbeheer',
          link: 'eredienst-mandatenbeheer.mandatarissen',
        },
        { label: 'Bekijk mandataris' },
      ],
    },
    {
      route: 'eredienst-mandatenbeheer.new',
      crumbs: [
        {
          label: 'Mandatenbeheer',
          link: 'eredienst-mandatenbeheer.mandatarissen',
        },
        { label: 'Voeg mandaat toe' },
      ],
    },
    {
      route: 'eredienst-mandatenbeheer.new-person',
      crumbs: [
        {
          label: 'Mandatenbeheer',
          link: 'eredienst-mandatenbeheer.mandatarissen',
        },
        { label: 'Voeg nieuwe persoon toe' },
      ],
    },
    {
      route: 'eredienst-mandatenbeheer.mandataris.contact-points.new',
      crumbs: [
        {
          label: 'Mandatenbeheer',
          link: 'eredienst-mandatenbeheer.mandatarissen',
        },
        {
          label: 'Bewerk mandataris',
          link: 'eredienst-mandatenbeheer.mandataris.edit',
        },
        { label: 'Nieuw contactgegeven' },
      ],
    },
    {
      route: 'eredienst-mandatenbeheer.mandataris.contact-points.edit',
      crumbs: [
        {
          label: 'Mandatenbeheer',
          link: 'eredienst-mandatenbeheer.mandatarissen',
        },
        {
          label: 'Bewerk mandataris',
          link: 'eredienst-mandatenbeheer.mandataris.edit',
        },
        { label: 'Wijzig contactgegeven' },
      ],
    },
    {
      route: 'worship-ministers-management.index',
      crumbs: [{ label: 'Bedienarenbeheer' }],
    },
    {
      route: 'worship-ministers-management.new',
      crumbs: [
        { label: 'Bedienarenbeheer', link: 'worship-ministers-management' },
        { label: 'Voeg bedienaar toe' },
      ],
    },
    {
      route: 'worship-ministers-management.new-person',
      crumbs: [
        { label: 'Bedienarenbeheer', link: 'worship-ministers-management' },
        { label: 'Voeg nieuwe persoon toe' },
      ],
    },
    {
      route: 'worship-ministers-management.minister.edit',
      crumbs: [
        { label: 'Bedienarenbeheer', link: 'worship-ministers-management' },
        { label: 'Bewerk bedienaar' },
      ],
    },
    {
      route: 'worship-ministers-management.minister.details',
      crumbs: [
        { label: 'Bedienarenbeheer', link: 'worship-ministers-management' },
        { label: 'Bekijk bedienaar' },
      ],
    },
  ];

  get crumbsForRoute() {
    const results = this.bread.filter(
      (value) => value.route === this.router.currentRouteName,
    );
    if (results.length <= 0) return [];
    return results[0].crumbs;
  }
}
