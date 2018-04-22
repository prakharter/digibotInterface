import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import {AppService} from "../app.service";

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  @Output() submitted: EventEmitter<any> = new EventEmitter<any>();
  constructor(private fb: FormBuilder , private _appService:AppService , private element:ElementRef) { }

  @Input() controlType:any;
  myForm: FormGroup;
  ngOnInit() {
    this.myForm = new FormGroup({});

    console.log("Inside onInit of dynamic Form");
    console.log(this.controlType);
    if(this.controlType.length!=0)
    this.myForm = this.createGroup();
    this._appService.getMicValue()
      .subscribe(item => {
        console.log("MicValue = "+item);
        setTimeout(()=>{    //<<<---    using ()=> syntax
          console.log("myForm  = "+this.myForm.valid);
          if(this.myForm.valid)
            this.element.nativeElement.querySelector('#submitBtn').click();
        },3000);
      });
   }

  onSubmit(form: any): void {
     console.log('you submitted value:', form);
     }

  createGroup() {
    console.log("inside createGroup");
    const group = this.fb.group({});
    console.log(this.controlType);
    this.controlType.forEach(control => group.addControl(control.Name, this.fb.control(null) ));
    return group;
  }

  submit(){
    console.log("Inside Submit Form");
    //alert("Submitting form");
    //event.preventDefault();
    if(this.myForm.valid){
      this.submitted.emit(this.myForm.value);
      //alert("noted");
    this._appService.emitLoading(true);
    }

  }
}
