import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-form-field-error',
  template: `
    <div class="text-danger">
      {{ erroMessage }}
    </div>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  public get erroMessage(): string | null{
    if(this.mustShowErroMessege()){
      return this.getErrorMessage();
    }else{
      return null;
    }
  }

  private mustShowErroMessege(): boolean{
    return this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
  }

  private getErrorMessage(): string | null{
    if(this.formControl.errors.required){
      return "nome obrigatório";
    }
    else if(this.formControl.errors.email){
      return "formato de e-mail inválido";
    }
    else if(this.formControl.errors.minlength){
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      return `o nome deve ter no minimo ${requiredLength} caracteres`;
    }
    else if(this.formControl.errors.maxlength){
      const requiredLength = this.formControl.errors.maxlength.requiredLength;
      return `o nome deve ter no máximo ${requiredLength} caracteres`;
    }
  }

}
