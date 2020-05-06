import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiPath: string = "api/entries";

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiPath).pipe(
      map(this.jsonDataToCategories),
      catchError(this.handleError)
    )
  }

  getById(id: number): Observable<Entry>{
    const url: string = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      map(this.jsonDataToEntry),
      catchError(this.handleError)
    )
  }

  cerate(entry: Entry): Observable<Entry>{
    return this.http.post(this.apiPath, entry).pipe(
      map(this.jsonDataToEntry),
      catchError(this.handleError)
    )
  }

  update(entry: Entry): Observable<Entry>{
    const url: string = `${this.apiPath}/${entry.id}`;
    return this.http.put(url, entry).pipe(
      map(() => entry),
      catchError(this.handleError)
    )
  }

  delete(id: number): Observable<any>{
    const url: string = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.handleError)
    )
  }

  // PRIVATE

  // Imprime um array de categorias
  private jsonDataToCategories(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry);
    });
    return entries;
  }

  // Imprime uma categoria por ID
  private jsonDataToEntry(jsonData: any): Entry{
    return Object.assign(new Entry(), jsonData);
  }

  // Erroa na requisição
  private handleError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO =>', error);
    return throwError(error);
  }
}
