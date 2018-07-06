import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('mandatenbeheer', function(){
    this.route('mandatarissen', function(){
      this.route('new');
      this.route('new-person');
      this.route('edit', {path: '/:id/edit'});
    });

    this.route('personen', function() {});
  });
  this.route('administratieve-gegevens', function() {});

  this.route('bbcdr', function() {
    this.route('rapporten', function() {
      this.route('new');
      this.route('edit', { path: '/:id' });
    });
  });

  this.route('toezicht', function() {
    this.route('inzendingen', function() {
      this.route('new');
      this.route('edit', { path: '/:id' });
    });
  });
  this.route('contact');
  this.route('pub', function() {
    this.route('toezicht', function() {
      this.route('inzendingen', function() {
        this.route('show', { path: '/:id' });
      });
    });
  });
  this.route('route-not-found', {
    path: '/*wildcard'
  });
});

export default Router;
