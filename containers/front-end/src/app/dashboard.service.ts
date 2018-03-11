import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
// Objects
import {Conference} from './conference';

@Injectable()
export class DashboardService {
  // IP address where map api server is being served
  readonly API_URL = 'https://www.ibm-fitchain.com';
  constructor(private http: HttpClient) { }

  /**
   * GET all conferences from the map-api server.
   */
  getConferences(): Observable<Conference[]> {
    const url = `${this.API_URL}/events`;
    return this.http.get<Conference[]>(url)
      .pipe( catchError(this.handleError('getConferences', [])));
  }

    /**
   * GET a conference by id from the map-api server.
   * @param string eventId - id of the conference
   */
  getConference(eventId: string): Observable<Conference> {
    const url = `${this.API_URL}/events/${eventId}`;
    return this.http.get<Conference>(url).pipe(
      catchError(this.handleError<Conference>(`getConference eventId=${eventId}`)));
  }


  /**
 * GET total steps from the registeree server.
 */
  getTotalSteps(): Observable<object[]> {
    const url = `${this.API_URL}/registerees/totalSteps`;
    return this.http.get<object[]>(url)
      .pipe(catchError(this.handleError('getTotalSteps', [])));
  }

/**
 * GET total calories from the registeree server.
 */
  getTotalCalories(): Observable<object[]> {
    const url = `${this.API_URL}/registerees/totalCalories`;
    return this.http.get<object[]>(url)
      .pipe(catchError(this.handleError('getTotalCalories', [])));
  }

  /**
 * GET total calories from the registeree server.
 */
  getTotalUsers(): Observable<object> {
    const url = `${this.API_URL}/registerees/totalUsers`;
    return this.http.get<object>(url)
      .pipe(catchError(this.handleError('getTotalUsers', {})));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param string operation - name of the operation that failed
   * @param any result - optional value to return as the observable result
   */
  private handleError<T> (operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
