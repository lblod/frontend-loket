import EmberRouter from '@ember/routing/router';
import config from 'frontend-loket/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('switch-login');
  this.route('mock-login');

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

  this.route('route-not-found', {
    path: '/*wildcard',
  });
  this.route('help');

  this.route('eredienst-mandatenbeheer', function () {
    this.route('mandatarissen');

    this.route('mandataris', { path: '/mandataris/:mandateeId' }, function () {
      this.route('edit');
    });
    this.route('new');
    this.route('new-person');
  });

  this.route('worship-ministers-management', { path: 'bedienarenbeheer' }, function () {
    this.route('new', { path: '/nieuw' });
    this.route('minister', { path: '/bedienaar/:bedienaar_id' }, function () {
      this.route('index'); // overview page
      this.route('edit', { path: '/:bedienaar_id/bewerk' });
    });
  });
});
