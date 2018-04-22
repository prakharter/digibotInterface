/**
 * Created by Prakhar.Srivastava on 2017/10/02.
 */
import {Component, OnInit, Renderer, ElementRef} from '@angular/core';
import {FormGroup} from "@angular/forms";


@Component({
  selector: 'form-checkbox',
  styleUrls: ['./form-checkbox.component.css'],
  template: `

    <div 
      class="dynamic-field form-checkbox" 
      [formGroup]="group">
    <div class="form-check">
  <label class="form-check-label" style="margin-left: 10%;color:white;font-size: large;">
    <input class="form-check-input" type="radio" [attr.name]="config.Name" value="me" [formControlName]="config.Name">
    Me
  </label>
</div>
<div class="form-check">
  <label class="form-check-label" style="margin-left: 10%;color:white;font-size: large;">
    <input class="form-check-input" type="radio" [attr.name]="config.Name" value="other" [formControlName]="config.Name">
     Other
  </label>
</div>
     </div>
  `
})
export class FormCheckboxComponent implements OnInit {


  config;
  group: FormGroup;
  constructor() {}
  ngOnInit() {
  }
}
