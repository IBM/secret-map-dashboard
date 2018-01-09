import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import {Conference} from './conference';
import {ConferenceAttendee} from './conferenceAttendee';

@Injectable()
export class DashboardService {
  private mapApiURL = 'http://169.46.74.117';

  constructor(private http: HttpClient) { }

  /** GET conferences from the map-api server */
  getConferences(): Observable<Conference[]> {
    const url = `${this.mapApiURL}/events`
    return this.http.get<Conference[]>(url)
      .pipe(
        tap(conferences => {
          console.log(`fetched conferences`);
      }),
        catchError(this.handleError('getConferences', []))
      );
  }

  /** GET conference by id from the map-api server */
  getConference(eventId: string): Observable<Conference> {
    const url = `${this.mapApiURL}/events/${eventId}`;
    return this.http.get<Conference>(url).pipe(
        tap(conference => {
          console.log(`fetched conference eventId=${eventId}`);
        }),
        catchError(this.handleError<Conference>(`getConference eventId=${eventId}`))
    );
  }

  /** GET conferenceAttendees from the map-api server 
   * Not yet Implemented
  */
  getConferenceAttendees(): Observable<ConferenceAttendee[]> {
    return this.http.get<ConferenceAttendee[]>( this.mapApiURL + 'get_attendees')
      .pipe(
        tap(conferenceAttendees => console.log(`fetched conferenceAttendees`)),
        catchError(this.handleError('getConferenceAttendees', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
