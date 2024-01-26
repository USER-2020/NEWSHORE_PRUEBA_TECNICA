import { Injectable } from '@angular/core';
import { urlBase_1, urlBase_2, urlBase_3 } from '../environments/environments';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import axios, { AxiosResponse } from 'axios';
import { Journey } from '../models/journey.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlApi_1 = urlBase_1;
  private urlApi_2 = urlBase_2;
  private urlApi_3 = urlBase_3;

  constructor() { }

  public getData1(): Observable<any> {
    return new Observable(observer => {
      axios.get(`${this.urlApi_1}`)
        .then((res: AxiosResponse) => {
          observer.next(res.data);
          observer.complete();
        })
        .catch((error) => {

          observer.error(error);
        });
    }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  public getData2(): Observable<any> {
    return new Observable(observer => {
      axios.get(`${this.urlApi_2}`)
        .then((res) => {
          observer.next(res.data);
          observer.complete();
        }).catch((err) => console.log(err));
    })
  }

  public getData3(): Observable<any> {
    return new Observable(observer => {
      axios.get(`${this.urlApi_3}`)
        .then((res) => {
          observer.next(res.data);
          observer.complete();
        }).catch((err) => console.log(err));
    })
  }


}
