import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('mandatenbeheer', function() {
  });
  this.route('login');
  this.route('route-not-found', {
    path: '/*wildcard'
  });
  this.route('mandatenbeheer', function() {});
  this.route('administratieve-gegevens', function() {});
});

export default Router;
