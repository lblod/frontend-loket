import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ContactFormComponent extends Component {
  @tracked selectedSubject = null;

  subjectOptions = [
    {
      label: 'Een vraag of probleem over de applicatie',
      subject: 'Vraag of probleem',
    },
    {
      label: 'Toezicht',
    },
    {
      label: 'Berichtencentrum',
    },
    {
      label: 'BBC-DR',
    },
    {
      label: 'Mandatenbeheer',
    },
    {
      label: 'Leidinggevendenbeheer',
    },
    {
      label: 'Personeelsbeheer',
    },
  ];

  get canSend() {
    return Boolean(this.selectedSubject);
  }

  get mailto() {
    if (this.canSend) {
      return `mailto:LoketLokaalBestuur@vlaanderen.be?subject=${this.selectedSubject} - Loket Lokaal Bestuur`;
    } else {
      return '';
    }
  }
}
