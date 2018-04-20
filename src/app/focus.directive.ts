/**
 * Created by Prakhar.Srivastava on 2017/08/28.
 */
import {Directive, OnInit, ElementRef, Input, Renderer, HostListener} from '@angular/core';

@Directive({
  selector: '[myAutofocus]'
})
export class AutofocusDirective implements OnInit {

  constructor(private elementRef: ElementRef , public renderer: Renderer) {};

  @Input() focus:boolean;
  ngOnInit(): void {
    if(this.focus == true)
    this.elementRef.nativeElement.focus();
  }

  @HostListener('focus', ['$event']) onFocus(e) {
    this.renderer.setElementClass(this.elementRef.nativeElement, 'tn_focus', true);
    this.renderer.setElementClass(this.elementRef.nativeElement, 'animated', true);
    this.renderer.setElementClass(this.elementRef.nativeElement, 'pulse', true);
    return;
  }
  @HostListener('blur', ['$event']) onblur(e) {
    this.renderer.setElementClass(this.elementRef.nativeElement, 'tn_focus', false);
    this.renderer.setElementClass(this.elementRef.nativeElement, 'animated', false);
    this.renderer.setElementClass(this.elementRef.nativeElement, 'pulse', false);
    return;
  }

}
