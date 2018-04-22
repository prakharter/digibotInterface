import {Component, ElementRef, ViewChildren, Renderer, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "../app.service";
import {SpeechRecognitionService} from "../SppechRecognitionService";



@Component({
  selector: 'footer-button',
  templateUrl: './footer.component.html',
  styleUrls: ['../app.component.css','../layout.css']
})

export class FooterComponent {
  constructor(private _appService:AppService,private element:ElementRef
  ,private speechRecognitionService: SpeechRecognitionService){}
  hideFooter:boolean = true;
  hideMic:boolean = true;
  newMessage:string;
  placeholder:string;
  OSHide:boolean = false;
  readyMic:boolean = false;

  ngOnInit(){
    this._appService.getFooter()
      .subscribe(item => {
        console.log("footer = "+item);
        this.hideFooter = item;
      });

    this._appService.getMic()
      .subscribe(item => {
        console.log("Mic = "+item);
        this.hideMic = item;
      });

    this._appService.getMicValue()
      .subscribe(item => {
        console.log("MicValue = "+item);
        if(!this.hideFooter) {
          this.sendMessage(item);
        }
        this.newMessage = '';
      });

    this._appService.getPlaceholder()
      .subscribe(item => {
        console.log("placeholder = "+item);
        this.placeholder = item;
      });
  }
  sendMessage(message){
    //this.scrollToBottom();
    //alert("Inside SendMessage");
    if(message!=''){
      this.newMessage = '';
      //alert("Inside SendMessage");
      var responseJson = {
        "response":{
          "state":{
            "StateID":"",
            "Message":message,
            "BotImg":"",
            "BackgroundImg":"",
            "Name":"",
            "WorkflowType":"",
            "SessionId":this._appService.getSessionId(),
            "MessageHeight":"70px",
            "Method":"WitState",
            "MinHeight":"280px",
            "IsVoice":true
          },
          isClient:'1',
          isChat:'true',
          "quickReplies":[],
          "clickImages":[],
          "controlType":[],
          "embedVideos":[],
          "feedback":[]
        }
      };
      //alert("Inside SendMessage");
      this._appService.emitLoading(true);
      this._appService.emitMinHeight('120px');
      let method = this._appService.getMethod();
      // alert("method = "+method);
      let intent = this._appService.getIntent();
      // alert("intent = "+intent);
      let StateId = this._appService.getStateId();
      // alert("StateId = "+StateId);
      let ResultingStateId = this._appService.getResultingStateId();
      // alert("ResultingStateId = "+ResultingStateId);
      //alert("Before sending the message StateId = "+StateId);
      this._appService.setChat(responseJson.response);
      this._appService.sendBotMessage(message , method , intent , StateId , ResultingStateId).subscribe(
        chatResponse => {
         // alert("received send Message");
         // alert(chatResponse.response.quick_replies);
          this._appService.setChat(chatResponse.response);
          this._appService.emitLoading(false);
          setTimeout(() => {
           this._appService.emitScroll(true);
            this.newMessage = '';
          });
        },
        error => {
          console.log(error);
          this._appService.emitLoading(false);
          setTimeout(() => {
            this._appService.emitScroll(true);
            this.newMessage = '';
          });
        }
      )
    }

  }
  stopSpeechRecognition():void {
    this.element.nativeElement.querySelector('.listening').style.display = 'none';
    this.element.nativeElement.querySelector('.ready').style.display = 'block';
    this.speechRecognitionService.DestroySpeechObject();
  }
  activateSpeechSearchMovie(): void {
    this.readyMic = !this.readyMic;
    this.element.nativeElement.querySelector('.listening').style.display = 'block';
    this.element.nativeElement.querySelector('.ready').style.display = 'none';

    this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          //this.addBotItem(value);
          console.log(value);
          this.newMessage = value;
          this._appService.emitMicValue(value);

          this.stopSpeechRecognition();
        },
        //errror
        (err) => {
          console.log(err);
          if (err.error == "no-speech") {
            console.log("--restatring service--");
            //this.activateSpeechSearchMovie();
            this.stopSpeechRecognition();
          }
        },
        //completion
        () => {
          // this.showSearchButton = true;
          console.log("--complete--");
          this.stopSpeechRecognition();
        });
  }


}
