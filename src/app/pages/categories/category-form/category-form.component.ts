import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap } from "rxjs/operators";
import toastr from "toastr";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  currecyAction: string; //define se está editando ou criando um novo recurso  
  pegeTitle: string; //define o titulo da pagina de acordo com currecyAction (edit | new)
  serverErrorMessages: string[] = null; //Exibi um array de mensagens de erros do servidor
  categoryForm: FormGroup; //Formulário de categoria do tipo FormGroup
  submitingForm: boolean = false; //Objeto desabilita o botão enviar para não enviar várias vezes
  category: Category = new Category(); //Objeto do recurso a ser trabalhado na pagina

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute, // rota
    private router: Router, //roteador
    private formBuilder: FormBuilder //contrutor de formulários
  ) { }

  ngOnInit(): void {
    this.setCurrecyAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void{
    this.setPageTitle();
  }

  // função para submeter o formulário
  submitForm(): void{
    this.submitingForm = true;

    if(this.currecyAction == 'new'){
      this.createCategory();
    }else{
      this.updateCategory();
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
  private buildCategoryForm(): void {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  // carrega a categoria por ID
  private loadCategory(): void {
    if (this.currecyAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
      .subscribe((category) => {
        this.category = category;
        this.categoryForm.patchValue(category); // bind s loaded category data to categoryForm
      },
      (error) => console.log('Ocorreu um erro no servidor, tente mais tarde.'))
    }
  }

  // altera o titulo da página conforme o valor da váriavel ( currecyAction )
  private setPageTitle(): void{
    if(this.currecyAction == 'new'){
      this.pegeTitle = 'Cadastro de nova categoria.'
    }else{
      const categoryName = this.category.name || '';
      this.pegeTitle = `Edintando categoria: ${categoryName}`;
    }
  }

  private createCategory(): void{
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    
    // cadastra os dados no in-memory-web-api
    this.categoryService.cerate(category).subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
    )
  }

  private updateCategory(): void{
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category).subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
    )
  }

  // feedback de sucesso no cadastro da nova categoria
  private actionForSuccess(category: Category): void{
    toastr.success('Solicitação enviada com sucesso!');
    
    // redirect/realod component page categories/id/edir
    this.router.navigateByUrl('categories', {skipLocationChange: true})
      .then(() => this.router.navigate(['categories', category.id, 'edit']))
  }

  // feedback de erros no cadastro da nova categoria
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
