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

  //mostra a mensagem de acordo com erro validado no campo
  public get erroMessage(): string | null{
    if( this.mustShowMessage() ){
      return this.getErrorMesssage();
    }else{
      return null;
    }
  }

  //valida se o campo foi tocado e mostra a mensagem
  private mustShowMessage(): boolean{
    return this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
  }

  //exibe as mensagens por erros
  private getErrorMesssage(): string | null{
    if(this.formControl.errors.required){
      return "dado obrigatório";
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
