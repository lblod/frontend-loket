import Model, {hasMany} from '@ember-data/model';

export default class ApplicationFormTable extends Model {
  @hasMany('application-form-entry') applicationFormEntries;
}
