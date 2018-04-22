import {Component, OnInit, Renderer, ElementRef} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {AppService} from "../app.service";


@Component({
  selector: 'form-input',
  styleUrls: ['./form-input.component.css'],
  template: `

    <div 
      class="dynamic-field form-input" 
      [formGroup]="group">
      <label [style.color]="config.FontColor">{{ config.Label }}</label>
      <input
        [attr.type]="config.InputType" [email]="config.InputType === 'email'"
        class="form-control" #inputName
        [pattern]="config.Attribute"
        [attr.maxlength]="config.MaxLength"
        [attr.placeholder]="config.Placeholder"
        [(ngModel)]="inputValue"
        [formControlName]="config.Name" value="{{config.DefaultValue}}"
         myAutofocus [focus]="config.Focus == 1" required ccNum />
    </div>
  `
})
export class FormInputComponent implements OnInit {


  config;
  group: FormGroup;
  inputValue:any;
  constructor(private _appService:AppService) {}
  ngOnInit() {
    console.log("Inside Input Component");
    console.log(JSON.stringify(this.config));
    this._appService.getMicValue()
      .subscribe(item => {
        console.log("MicValue = "+item);
        this.inputValue = item;

      });

  }
}
