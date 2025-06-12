import EmbroiderRouter from '@embroider/router';
import config from 'frontend-loket/config/environment';

export default class Router extends EmbroiderRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('switch-login');
  this.route('mock-login');
  this.route('impersonate');

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

  this.route('berichtencentrum', function () {
    this.route('berichten', function () {
      this.route('conversatie', { path: '/:id' }, function () {});
      this.route('new');
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
        },
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

  this.route('subsidies-external-redirect', { path: 'subsidy' }, function () {
    this.route('with-path', { path: '/*path' });
  });

  this.route(
    'lpdc-external-redirect',
    { path: '/producten-en-dienstencatalogus' },
    function () {
      // We need the child routes since `/producten-en-dienstencatalogus/*` won't match the case without a subpath
      // By using an index and named route with a path we work around that issue. The lpdc-external-redirect route
      // then retrieves the needed data from the transition object.
      this.route('with-path', { path: '/*path' });
    },
  );

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
        },
      );
    },
  );
});
