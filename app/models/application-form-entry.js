import Model, {attr} from '@ember-data/model';

export default class ApplicationFormEntry extends Model {
  @attr('string') actorName;
  @attr('number') numberChildrenForFullDay;
  @attr('number') numberChildrenForHalfDay;
  @attr('number') numberChildrenPerInfrastructure;
  @attr('number') totalAmount;
}
