import BaseModalsService from 'ember-promise-modals/services/modals';

export default class ModalsService extends BaseModalsService {
  // AuModal already creates a focus-trap so we can safely disable the ember-promise-modals version
  // More information: https://github.com/simplabs/ember-promise-modals#accessibility
  focusTrapOptions = null;
}
