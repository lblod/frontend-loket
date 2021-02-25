import Controller from '@ember/controller';

export default class SupervisionSubmissionsIndexController extends Controller {
  page = 0;
  size = 20;
  sort = 'status.label,-sent-date,-modified';
}
