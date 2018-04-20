import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {
  FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import {AppService} from "./app.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormInputComponent } from './form-input/form-input.component';
import { FormSelectComponent } from './form-select/form-select.component';
import { FormButtonComponent } from './form-button/form-button.component';
import { FormCheckboxComponent } from './form-checkbox/form-checkbox.component';
import {DynamicFieldDirective} from "./dynamic-field/dynamic-field.directive";
import {StarRatingModule} from "angular-star-rating";
import { RatingComponent } from './rating/rating.component';
import {NguiOverlayModule} from "@ngui/overlay";
import {MatButtonModule , MatChipsModule} from "@angular/material";
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import 'hammerjs';
import {ConfigurationService} from "./configuration/configuration";
import {AutofocusDirective} from "./focus.directive";
import {SafePipe} from "./safePipe";
import { ROUTES } from "./app.routing";
import { EmbedVideo } from 'ngx-embed-video';
import { EmojifyModule } from 'angular-emojify';
import {SpeechRecognitionService} from "./SppechRecognitionService";
import {Ng2DeviceDetectorModule} from "ng2-device-detector";
import {FooterComponent} from "./footer-button/footer.component";

@NgModule({
  declarations: [
    AppComponent,
    ChatMessageComponent,
    DynamicFormComponent,
    FormInputComponent,
    FormSelectComponent,
    FormButtonComponent,
    FormCheckboxComponent,
    DynamicFieldDirective,
    RatingComponent,
    AutofocusDirective,
    SafePipe,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    EmojifyModule,
    FormsModule,
    HttpModule,
    EmbedVideo.forRoot(),
    RouterModule.forRoot(ROUTES),
    BrowserAnimationsModule,
    Ng2DeviceDetectorModule.forRoot(),
    ReactiveFormsModule,
    StarRatingModule.forRoot(),
    NguiOverlayModule,
    MatButtonModule,
    MatChipsModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.5)',
      backdropBorderRadius: '10px',
      primaryColour: '#F2BE35',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop:true
    })

  ],
  providers: [AppService , ConfigurationService , SpeechRecognitionService  ],
  bootstrap: [AppComponent],
  entryComponents: [
    FormButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormCheckboxComponent
  ]
})
export class AppModule { }
