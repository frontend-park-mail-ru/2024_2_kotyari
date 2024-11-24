import { apiResponse } from '../../../../services/api/utils';
import { getWithCred } from '../../../../services/api/without-csrf';
import { backurl } from '../../../../services/app/config';
import { csrf } from '../../../../services/api/CSRFService';


export class AdminPanelApi {
  static getStatistic = ():Promise<apiResponse> => {
    return getWithCred(backurl+'/csat_admin');
  }

  static editQuestion = (type: string, newTitle: string):Promise<apiResponse>  => {
    return csrf.patch(backurl + '/csat_admin', {type: type, new_title: newTitle});
  }

  static deleteQuestion = (type: string):Promise<apiResponse>  => {
    return csrf.delete(backurl + '/csat_admin', {type: type});
  }

  static repeatSurvey = (type: string):Promise<apiResponse>  => {
    return csrf.put(backurl + '/csat_admin', {type: type});
  }
}