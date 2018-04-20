import {Component, Input} from "@angular/core";
import {ClickEvent, RatingChangeEvent, HoverRatingChangeEvent } from 'angular-star-rating';
import {AppService} from "../app.service";

@Component({
  selector: 'rating-feedback',
  template: `    
        
            <star-rating-control   [starType]="'svg'" 
                                [hoverEnabled]="true"
                                (onClick)="onClick($event)" 
                                (onRatingChange)="onRatingChange($event)"
                                (onHoverRatingChange)="onHoverRatingChange($event)"
                                [size]="'large'"
                                [speed]="'slow'"
                                [numOfStars]="5"
                                [space]="'around'"
                                [step]="0.5"
                                [showHalfStars]="true"
                                [disabled]="!isSubmitted">                             
            </star-rating-control>
            <button type="button" class="btn btn-outline-success" (click)="submitFeedback()" style="margin-top: 5%;" 
            *ngIf="isSubmitted">Submit</button>
            <!--<p>onHoverRatingChangeResult: {{onHoverRatingChangeResult | json}}</p>-->
            <!--<p>onClickResult: {{onClickResult | json}}</p>-->
            <!--<p>onRatingChangeResult: {{onRatingChangeResult | json}}</p>-->
    `
})
export class RatingComponent {

  constructor(private _appService:AppService){}
  @Input() Feedback:any;
  onClickResult:ClickEvent;
  onHoverRatingChangeResult:HoverRatingChangeEvent;
  onRatingChangeResult:RatingChangeEvent;
  isSubmitted:boolean = true;
  onClick = ($event:ClickEvent) => {
    console.log('onClick $event: ', $event);
    this.onClickResult = $event;
  };

  onRatingChange = ($event:RatingChangeEvent) => {
    console.log('onRatingUpdated $event: ', $event);
    this.onRatingChangeResult = $event;
  };

  onHoverRatingChange = ($event:HoverRatingChangeEvent) => {
    console.log('onHoverRatingChange $event: ', $event);
    this.onHoverRatingChangeResult = $event;
  };
  newChat:any;

  submitFeedback(){
    this._appService.emitLoading(true);
    this._appService.emitOpacity(true);
    this._appService.getStateInformation(null,this.Feedback.ResultingStateID,'','','').subscribe(
      chatResponse => {
        console.log(chatResponse.response);
        this._appService.setChat(chatResponse.response);
        this.isSubmitted = false;
        this._appService.emitLoading(false);
      },
      error => {
        console.log(error);
      }
    )

  }

}
