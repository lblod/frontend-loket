import Component from '@glimmer/component';

const STATUS_COLORS = {
  action: 'status-label__status-color--action',
  info: 'status-label__status-color--info',
  success: 'status-label__status-color--success',
  warning: 'status-label__status-color--warning',
};

export default class StatusLabel extends Component {
  get statusColor() {
    return STATUS_COLORS[this.args.skin];
  }
}
