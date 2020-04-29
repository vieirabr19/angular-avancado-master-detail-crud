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
  categoryForm: FormGroup; //Formulário de categoria do tipo FormGroup
  pegeTitle: string; //define o titulo da pagina de acordo com currecyAction (edit | new)
  serverErroMessages: string[] = null; //Exibi um array de mensagens de erros do servidor
  submitingForm: boolean = false; //Objeto desabilita o botão enviar para enviar não várias vezes
  category: Category = new Category(); //Objeto do recurso a ser trabalhado na pagina

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute, // rotas
    private router: Router, //roteador
    private formBuilder: FormBuilder //contrutor de formulários
  ) { }

  ngOnInit(): void {
    this.setCurrecyAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
  }

  //PRIVATE METHODS

  private setCurrecyAction(): void {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currecyAction = 'new';
    } else {
      this.currecyAction = 'edit';
    }
  }

  private buildCategoryForm(): void {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  private loadCategory(): void {
    if (this.currecyAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap((params) => this.categoryService.getById(+params.get('id')))
      )
      .subscribe((category) => {
        this.category = category;
        this.categoryForm.patchValue(category); // bind s loaded category data to categoryForm
      },
      (error) => console.log('Ocorreu um erro no servidor, tente mais tarde.'))
    }
  }

  setPageTitle(): void{
    if(this.currecyAction == 'new'){
      this.pegeTitle = 'Cadastro de Nova categoria.'
    }else{
      const categoryName = this.category.name || '';
      this.pegeTitle = `Edintando Categoria: ${categoryName}`;
    }
  }

}
