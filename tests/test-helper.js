import Application from 'frontend-loket/app';
import config from 'frontend-loket/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
