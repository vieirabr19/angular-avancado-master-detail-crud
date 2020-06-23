import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, catchError, map } from 'rxjs/operators';

import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { Entry } from './entry.model';
import { CategoryService } from "../../categories/shared/category.service";

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected injector: Injector,
    private categoryService: CategoryService
  ){
    super( "api/entries", injector, Entry.fromJson );
  }

  cerate(entry: Entry): Observable<Entry>{
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry>{
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  //carrega os meses e ano
  getByMonthAndYear(month: number, yaer: number): Observable<Entry[]>{
    // acessando de uma API
    // this.http.get("api/entries?month=month&year=year").subscribe(entries => console.log(entries))
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, yaer))
    )
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry>{
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError)
    )
  }

  private filterByMonthAndYear(entries: Entry[], month: number, year: number){
    return entries.filter(entry => {
      const entryDate = moment(entry.date, "DD/MM/YYYY"),
         monthMatches = entryDate.month() + 1 == month,
         yearMatches  = entryDate.year() == year;

      if(monthMatches && yearMatches) return entry;
    })
  }
}
