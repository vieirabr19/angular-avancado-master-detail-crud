import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { PegeHeaderComponent } from './components/pege-header/pege-header.component';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';

@NgModule({
  declarations: [
    BreadCrumbComponent,
    PegeHeaderComponent,
    FormFieldErrorComponent
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
    PegeHeaderComponent,
    FormFieldErrorComponent
  ]
})
export class SharedModule { }
