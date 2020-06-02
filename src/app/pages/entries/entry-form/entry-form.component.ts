import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from "@angular/forms";

import { BaseResourceFormComponent } from "../../../shared/components/base-resource-form/base-resource-form.component";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

import { Category } from "../../categories/shared/category.model";
import { CategoryService} from "../../categories/shared/category.service";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {
  categories: Category[]; //Objeto do tipo categoria

  imaskConfig = {
    mask: Number, //ativar máscara numérica
    scale: 2,  //dígitos após o ponto, 0 para números inteiros
    signed: false,
    thousandsSeparator: '',  //qualquer caractere único
    padFractionalZeros: true,  //se true, então preenche zeros no final do comprimento da escala
    normalizeZeros: true,  //acrescenta ou remove zeros nas extremidades
    radix: ',',  //delimitador fracionário
    mapToRadix: ['.']
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    dayNamesMin: ["Do","Se","Te","Qu","Qu","Se","Sa"],
    monthNames: [ "Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Augusto","Setembro","Outubro","Novembro","Dezembro" ],
    monthNamesShort: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Aug", "Set", "Out", "Nov", "Dez" ],
    today: 'Hoje',
    clear: 'Limpar',
    dateFormat: 'mm/dd/yy',
    weekHeader: 'Wk'
  };

  constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService, //categoryService
    protected injector: Injector
  ) { 
    super(injector, new Entry(), entryService, Entry.fromJson)
  }

  ngOnInit(): void {
    this.loadCategories();
    super.ngOnInit();
  }

  // monta um objeto de array com as opções do tipo
  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  // constroi o formulário
  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    })
  }

  // carrega as acaterias
  protected loadCategories(): void{
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  protected creationPageTitle(): string{
    return 'Criando novo lançamento.';
  }

  protected editionPageTitle(): string{
    const resourceName = this.resource.name || "";
    return `Editando lançamento: ${resourceName}`;
  }
}
