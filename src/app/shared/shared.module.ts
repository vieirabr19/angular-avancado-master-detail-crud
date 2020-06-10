import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { PegeHeaderComponent } from './components/pege-header/pege-header.component';

@NgModule({
  declarations: [
    BreadCrumbComponent,
    PegeHeaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    //shared module
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    //shared components
    BreadCrumbComponent,
    PegeHeaderComponent
  ]
})
export class SharedModule { }
