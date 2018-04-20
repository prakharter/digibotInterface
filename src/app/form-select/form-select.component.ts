import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'form-select',
  styleUrls: ['./form-select.component.css'],
  template: `
    <div 
      class="dynamic-field form-select"
      [formGroup]="group">
      <label [style.color]="config.FontColor">{{ config.Label }}</label>
      <select [formControlName]="config.Name" class="form-control" myAutofocus [focus]="config.Focus == 1" required
      style="width:100%;">
        <option value="">{{ config.Placeholder }}</option>
        <option *ngFor="let option of parsedOptions">
          {{ option }}
        </option>
      </select>
      <!--<pre>{{config | json}}</pre>-->
    </div>
  `
})
export class FormSelectComponent implements OnInit {

  config;
  group: FormGroup;
  parsedOptions:Array<string> = [];
  constructor() { }

  ngOnInit() {
    console.log(this.config.Options);
    this.parsedOptions = this.config.Options.split(",");
  }

}
