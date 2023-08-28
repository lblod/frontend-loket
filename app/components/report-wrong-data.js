import Component from '@glimmer/component';

export default class ReportWrongDataComponent extends Component {
  get subject() {
    return 'Melden van onvolledige of foutieve data';
  }

  get body() {
    const url = encodeURIComponent(window.location.href);
    return `URL met onvolledige of foutieve data: ${url}`;
  }
}
