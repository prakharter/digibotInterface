/**
 * Created by Prakhar.Srivastava on 2017/08/28.
 */

import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";



@Injectable()
export class ConfigurationService {
  public url:string = environment.URL;
// public url:string = '';
  getURL(){
    return this.url;
  }
}


