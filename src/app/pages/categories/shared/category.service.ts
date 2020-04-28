import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiPath: string = "api/categories";

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiPath).pipe(
      map(this.jsonDataToCategories),
      catchError(this.handleError)
    )
  }

  getById(id: number): Observable<Category>{
    const url: string = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      map(this.jsonDataToCategory),
      catchError(this.handleError)
    )
  }

  cerate(category: Category): Observable<Category>{
    return this.http.post(this.apiPath, category).pipe(
      map(this.jsonDataToCategory),
      catchError(this.handleError)
    )
  }

  update(category: Category): Observable<Category>{
    const url: string = `${this.apiPath}/${category.id}`;
    return this.http.put(url, category).pipe(
      map(() => category),
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
  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  // Imprime uma categoria por ID
  private jsonDataToCategory(jsonData: any): Category{
    return jsonData as Category;
  }

  // Erroa na requisição
  private handleError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO =>', error);
    return throwError(error);
  }
}
