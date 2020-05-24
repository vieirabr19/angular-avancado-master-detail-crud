import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap } from "rxjs/operators";
import toastr from "toastr";

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {
  currecyAction: string; //define se está editando ou criando um novo recurso  
  resourceForm: FormGroup; //Formulário do tipo FormGroup
  pegeTitle: string; //define o titulo da pagina de acordo com currecyAction (edit | new)
  serverErrorMessages: string[] = null; //Exibi um array de mensagens de erros do servidor
  submitingForm: boolean = false; //Objeto desabilita o botão enviar para não enviar várias vezes

  protected route: ActivatedRoute; // rota
  protected router: Router; //roteador
  protected formBuilder: FormBuilder; //contrutor de formulários

  constructor(
    protected injector: Injector,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData: any) => T,
    public resource: T
  ){
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
   }

  ngOnInit(): void {
    this.setCurrecyAction();
    this.buildCResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void{
    this.setPageTitle();
  }

  // função para submeter o formulário
  submitForm(): void{
    this.submitingForm = true;

    if(this.currecyAction == 'new'){
      this.createResource();
    }else{
      this.updateResource();
    }
  }

  //PROTECTED METHODS

  protected setCurrecyAction(): void {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currecyAction = 'new';
    } else {
      this.currecyAction = 'edit';
    }
  }

  // carrega a categoria por ID
  protected loadResource(): void {
    if (this.currecyAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      )
      .subscribe((resource) => {
        this.resource = resource;
        this.resourceForm.patchValue(resource); // bind s loaded resource data to resourceForm
      },
      (error) => console.log('Ocorreu um erro no servidor, tente mais tarde.'))
    }
  }

  // altera o titulo da página conforme o valor da váriavel ( currecyAction )
  protected setPageTitle(): void{
    if(this.currecyAction == 'new'){
      this.pegeTitle = this.creationPageTitle();
    }else{
      this.pegeTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string{
    return 'Novo';
  }

  protected editionPageTitle(): string{
    return 'Edição';
  }

  protected createResource(): void{
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    
    // cadastra os dados no in-memory-web-api
    this.resourceService.create(resource).subscribe(
      resource => this.actionForSuccess(resource),
      error => this.actionForError(error)
    )
  }

  protected updateResource(): void{
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource).subscribe(
      resource => this.actionForSuccess(resource),
      error => this.actionForError(error)
    )
  }

  // feedback de sucesso no cadastro da nova categoria
  protected actionForSuccess(resource: T): void{
    toastr.success('Solicitação processada com sucesso!');
    const baseComponentPath = this.route.snapshot.parent.url[0].path;
    
    // redirect/realod component page categories/id/edir
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true})
      .then(() => this.router.navigate([baseComponentPath, resource.id, 'edit']))
  }

  // feedback de erros no cadastro da nova categoria
  protected actionForError(error: any): void{
    toastr.error('Ocorreu um erro ao porcessar a sua solicitação!');
    this.submitingForm = false;

    if(error.status === 422){
      this.serverErrorMessages = JSON.parse(error._body).error;
    }else{
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde!'];
    }
  }

  protected abstract buildCResourceForm(): void;

}
