import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { Entry } from './entry.model';
import { CategoryService } from "../../categories/shared/category.service";

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected injector: Injector,
    private categoryService: CategoryService
  ){ super("api/entries", injector); }

  cerate(entry: Entry): Observable<Entry>{
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.cerate(entry);
      })
    )
  }

  update(entry: Entry): Observable<Entry>{
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    )
  }

  // PROTECTED

  // Imprime um array de categorias
  protected jsonDataToResources(jsonData: any[]): Entry[] {
    const resources: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      resources.push(entry);
    });
    return resources;
  }

  // Imprime uma categoria por ID
  protected jsonDataToResource(jsonData: any): Entry{
    return Object.assign(new Entry(), jsonData);
  }

}
