import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap } from "rxjs/operators";
import toastr from "toastr";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currecyAction: string; //define se está editando ou criando um novo recurso  
  pegeTitle: string; //define o titulo da pagina de acordo com currecyAction (edit | new)
  serverErrorMessages: string[] = null; //Exibi um array de mensagens de erros do servidor
  entryForm: FormGroup; //Formulário de lançamento do tipo FormGroup
  submitingForm: boolean = false; //Objeto desabilita o botão enviar para não enviar várias vezes
  entry: Entry = new Entry(); //Objeto do recurso a ser trabalhado na pagina

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute, // rota
    private router: Router, //roteador
    private formBuilder: FormBuilder //contrutor de formulários
  ) { }

  ngOnInit(): void {
    this.setCurrecyAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked(): void{
    this.setPageTitle();
  }

  // função para submeter o formulário
  submitForm(): void{
    this.submitingForm = true;

    if(this.currecyAction == 'new'){
      this.createEntry();
    }else{
      this.updateEntry();
    }
  }

  //PRIVATE METHODS

  private setCurrecyAction(): void {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currecyAction = 'new';
    } else {
      this.currecyAction = 'edit';
    }
  }

  // constroi o formulário
  private buildEntryForm(): void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    })
  }

  // carrega a lançamento por ID
  private loadEntry(): void {
    if (this.currecyAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe((entry) => {
        this.entry = entry;
        this.entryForm.patchValue(entry); // bind s loaded entry data to entryForm
      },
      (error) => console.log('Ocorreu um erro no servidor, tente mais tarde.'))
    }
  }

  // altera o titulo da página conforme o valor da váriavel ( currecyAction )
  private setPageTitle(): void{
    if(this.currecyAction == 'new'){
      this.pegeTitle = 'Cadastro de novo lançamento.'
    }else{
      const entryName = this.entry.name || '';
      this.pegeTitle = `Edintando lançamento: ${entryName}`;
    }
  }

  private createEntry(): void{
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    
    // cadastra os dados no in-memory-web-api
    this.entryService.cerate(entry).subscribe(
      entry => this.actionForSuccess(entry),
      error => this.actionForError(error)
    )
  }

  private updateEntry(): void{
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry).subscribe(
      entry => this.actionForSuccess(entry),
      error => this.actionForError(error)
    )
  }

  // feedback de sucesso no cadastro da nova lançamento
  private actionForSuccess(entry: Entry): void{
    toastr.success('Solicitação enviada com sucesso!');
    
    // redirect/realod component page entries/id/edir
    this.router.navigateByUrl('entries', {skipLocationChange: true})
      .then(() => this.router.navigate(['entries', entry.id, 'edit']))
  }

  // feedback de erros no cadastro da nova lançamento
  private actionForError(error: any): void{
    toastr.error('Ocorreu um erro ao porcessar a sua solicitação!');
    this.submitingForm = false;

    if(error.status === 422){
      this.serverErrorMessages = JSON.parse(error._body).error;
    }else{
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde!'];
    }
  }

}
