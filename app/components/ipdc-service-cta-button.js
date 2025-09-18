import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { getPublicServiceCta } from '../utils/get-public-service-cta';

export default class IpdcServiceCtaButtonComponent extends Component {
  @tracked callToAction;

  constructor() {
    super(...arguments);
    this.setCallToAction();
  }

  async setCallToAction() {
    this.callToAction = await getPublicServiceCta(this.args.model);
  }
}
