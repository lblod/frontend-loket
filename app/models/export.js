import DS from 'ember-data';
import attr from 'ember-data/attr';
import { computed } from '@ember/object';
import _moment from 'ember-moment/computeds/moment';
import format from 'ember-moment/computeds/format';

export default DS.Model.extend({
  filename: attr,
  format: attr,
  filesize: attr,
  created: attr('datetime'),

  filesizeMb: computed('filesize', function () {
    return this.filesize
      ? +(Math.round(this.filesize / 1000 / 1000 + 'e+1') + 'e-1')
      : 0;
  }),
  createdFormatted: format(_moment('created'), 'DD/MM/YYYY HH:mm'),
});
