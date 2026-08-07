import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class WorshipMinistersManagementPositionSelectComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);

    this.optionsPromise = this.loadMinisterPositions();
  }

  async loadMinisterPositions() {
    const positions = await this.store.query('minister-position', {
      'filter[worship-service][:uri:]': this.args.worshipService.uri,
      include: 'function.applicable-statuses',
    });
    const organizationStatus =
      await this.args.worshipService.organizationStatus;

    return positions.filter((position) =>
      this.isPositionApplicable(position, organizationStatus),
    );
  }

  isPositionApplicable(position, organizationStatus) {
    const applicableStatuses =
      position
        .belongsTo('function')
        .value()
        ?.hasMany('applicableStatuses')
        .value() ?? [];

    return (
      applicableStatuses.length === 0 ||
      applicableStatuses.some((status) => status.id === organizationStatus?.id)
    );
  }
}
