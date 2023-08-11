import EmberRouter from '@ember/routing/router';
import config from 'frontend-loket/config/environment';
import isFeatureEnabled from './helpers/is-feature-enabled';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('switch-login');
  this.route('mock-login');

  this.route('auth', { path: '/authorization' }, function () {
    this.route('callback');
    this.route('login');
    this.route('logout');
    this.route('switch');
  });

  this.route('contact');

  this.route('legaal', function () {
    this.route('disclaimer');
    this.route('cookieverklaring');
    this.route('toegankelijkheidsverklaring');
  });

  this.route('mandatenbeheer', function () {
    this.route('mandatarissen', function () {
      this.route('new');
      this.route('new-person');
      this.route('edit', { path: '/:id/edit' });
    });

    this.route('personen', function () {});
    this.route('fracties', function () {});
  });

  this.route('bbcdr', function () {
    this.route('rapporten', function () {
      this.route('new');
      this.route('edit', { path: '/:id' });
    });
  });

  this.route('supervision', function () {
    this.route('submissions', function () {
      this.route('new');
      this.route('edit', { path: '/:id' });
    });
  });

  this.route('toezicht', function () {
    this.route('inzendingen', function () {
      this.route('new');
      this.route('edit', { path: '/:id' });
    });
  });

  this.route('berichtencentrum', function () {
    this.route('berichten', function () {
      this.route('conversatie', { path: '/:id' }, function () {});
    });
  });

  this.route('leidinggevendenbeheer', function () {
    this.route('bestuursfuncties', function () {
      this.route(
        'bestuursfunctie',
        { path: '/:bestuursfunctie_id' },
        function () {
          this.route('contact-info');
          this.route('functionarissen', function () {
            this.route('edit', { path: '/:functionaris_id/edit' });
            this.route('new-person');
            this.route('new', function () {
              this.route('periode', { path: '/:persoon_id/periode' });
            });
          });
        }
      );
    });
  });

  this.route('personeelsbeheer', function () {
    this.route('personeelsaantallen', function () {
      this.route('latest', { path: '/:dataset_id/latest' });
      this.route('periodes', { path: '/:dataset_id/periodes' }, function () {
        this.route('edit', { path: '/:period_id' });
      });
    });
  });

  this.route('subsidy', function () {
    this.route('applications', function () {
      this.route('available-subsidies');
      this.route('new');
      this.route('edit', { path: '/:id' }, function () {
        this.route('step', { path: '/steps/:step_id' }, function () {
          this.route('new');
          this.route('edit', { path: '/forms/:form_id' });
        });
      });
    });
  });

  if (!isFeatureEnabled('lpdc-external')) {
    this.route(
      'public-services',
      { path: '/producten-en-dienstencatalogus' },
      function () {
        this.route('add', { path: '/toevoegen' });
        this.route('new', { path: '/nieuw' });
        this.route('details', { path: '/:serviceId' }, function () {
          this.route('content', { path: '/inhoud' });
          this.route('properties', { path: '/eigenschappen' });
        });
        this.route(
          'link-concept',
          { path: '/:serviceId/koppelen' },
          function () {
            this.route('link', { path: '/:conceptId' });
          }
        );
        this.route(
          'concept-details',
          { path: '/concept/:conceptId' },
          function () {
            this.route('content', { path: '/inhoud' });
            this.route('properties', { path: '/eigenschappen' });
          }
        );
      }
    );
  } else {
    this.route(
      'lpdc-external-redirect',
      { path: '/producten-en-dienstencatalogus' },
      function () {
        // We need the child routes since `/producten-en-dienstencatalogus/*` won't match the case without a subpath
        // By using an index and named route with a path we work around that issue. The lpdc-external-redirect route
        // then retrieves the needed data from the transition object.
        this.route('with-path', { path: '/*path' });
      }
    );
  }

  this.route('route-not-found', {
    path: '/*wildcard',
  });

  this.route('eredienst-mandatenbeheer', function () {
    this.route('mandatarissen');

    this.route('mandataris', { path: '/mandataris/:mandateeId' }, function () {
      this.route('details');
      this.route('edit');
    });
    this.route('new');
    this.route('new-person');
  });

  this.route(
    'worship-ministers-management',
    { path: 'bedienarenbeheer' },
    function () {
      this.route('new', { path: '/nieuw' });
      this.route('new-person', { path: '/nieuw-bedienaar' });

      this.route(
        'minister',
        { path: '/bedienaar/:worshipMinisterId' },
        function () {
          this.route('details', { path: '/bekijk' });
          this.route('edit', { path: '/bewerk' });
        }
      );
    }
  );
  this.route('administrative-units', { path: '/contact-info' }, function () {
    this.route('administrative-unit', { path: '/admin-unit/' }, function () {
      this.route('sites', { path: '/vestigingen' }, function () {
        this.route('edit');
      });
    });
  });

  this.route('contact-data', { path: '/contactgegevens' }, function () {
    this.route('core-data-overview', { path: '/overzicht-kerngegevens' });
  });
});
