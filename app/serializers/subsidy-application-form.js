import ApplicationSerializer from './application';

export default class SubsidyApplicationFormSerializer extends ApplicationSerializer {
  attrs = {
    projectName: { serialize: false },
  };
}
