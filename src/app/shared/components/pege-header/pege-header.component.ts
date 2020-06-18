import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pege-header',
  templateUrl: './pege-header.component.html',
  styleUrls: ['./pege-header.component.css']
})
export class PegeHeaderComponent implements OnInit {

  @Input('page-title') pegeTitle: string;
  @Input('button-text') buttonText: string;
  @Input('button-class') buttonClass: string;
  @Input('button-link') buttonLink: string;
  @Input('show-button') ShowButton: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
