import {Component, ElementRef, ViewChildren, Renderer, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "./app.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {IWindow} from "./IWindow";
import {SpeechRecognitionService} from "./SppechRecognitionService";
import {Ng2DeviceService} from "ng2-device-detector";

// import "https://code.responsivevoice.org/responsivevoice.js";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./layout.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ]
})
export class AppComponent {


  @ViewChild ('scrollMe') private myScrollContainer;

  scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scrollIntoView(false);
  }
  placeholder:string;
  public loading = true;
  Focus:boolean = false;
  DigiId:string = '';
  ClassName:string;
  hideApp:boolean = false;
  loggedIn:boolean = false;
  deviceInfo:any;
  browser:any;
  device:any;
  OSHide:boolean = false;
  newMessage:string;
  readyMic:boolean = false;
  method:string;
  intent:string;
  StateId;String;
  ResultingStateId:string;
  hideFooter:boolean = true;
  hideMic:boolean = true;
  constructor(private _appService:AppService ,private element:ElementRef,private deviceService: Ng2DeviceService
    ,private activatedRoute: ActivatedRoute,
              private speechRecognitionService: SpeechRecognitionService){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log("device info = "+JSON.stringify(this.deviceInfo));
    this.browser = this.deviceInfo.browser;
    this.device = this.deviceInfo.device;
    if(this.device !='iphone' && this.browser === 'chrome')
    this.OSHide = false;
    else this.OSHide = true;
    this._appService.chats.subscribe(data => {
      this.chats.push(data);
      console.log("data = "+JSON.stringify(data));
      this.method = data.state.Method;
      this.intent = data.state.Intent;
      this.StateId = data.state.StateID;
      if(data.state.Logging == 1 )
      this.loggedIn = true;
      else if(data.state.Logging == 2)
        this.loggedIn = false;
      this.ResultingStateId = data.state.ResultingStateID;
      console.log("method1 = "+this.method);
      this._appService.setMethod(this.method);
      this._appService.setIntent(this.intent);
      this._appService.setStateId(this.StateId);
      this._appService.setResultingStateId(this.ResultingStateId);
      setTimeout(() => {
        this.scrollToBottom();
      });
    });
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.DigiId = params['DigiId'];
      console.log("before getDefaultState in app.component");
      if(this.DigiId) {
        console.log("DigiId = " + this.DigiId);
         this._appService.getStartFlow()
         .subscribe(item => {
        this._appService.getDefaultState('start', this.DigiId).subscribe(
          chatResponse => {
            console.log("After getting results from getDefaultState chatResponse = " + JSON.stringify(chatResponse.response));
            this.chats.push(chatResponse.response);
            this.intent = chatResponse.response.state.Intent;
            this.method = chatResponse.response.state.Method;
            this.ClassName = chatResponse.response.state.ClassName;
            console.log("method = " + this.method);
            this.loading = false;
          },
          error => {
            console.log(error);
            this.loading = false;
          }
        )
      });

      }

    });

    this._appService.ReceiveCCCChat().subscribe(
      chatResponse => {
        console.log("After getting results from ReceiveCCCChat chatResponse = "+JSON.stringify(chatResponse.response));
        this._appService.emitMinHeight('120px');
        this._appService.setChat(chatResponse.response);
       // this.chats.push(chatResponse.response);
        this.intent = chatResponse.response.state.Intent;
        this.method = chatResponse.response.state.Method;
        console.log("method = "+this.method);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    )
  }

  ngOnDestroy() {
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
          this.addBotItem(value);
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

  stopSpeechRecognition():void {
    this.element.nativeElement.querySelector('.listening').style.display = 'none';
    this.element.nativeElement.querySelector('.ready').style.display = 'block';
    this.speechRecognitionService.DestroySpeechObject();
  }


addError(text) {

}
  addBotItem(text) {
  // const appContent = document.querySelector(".app-content");
  // appContent.innerHTML += '<div class="item-container item-container-bot"><div class="item"><p>' + text + '</p></div></div>';
  // appContent.scrollTop = appContent.scrollHeight; // scroll to bottom
}
  ngOnInit(){


     this.addBotItem("Hi! I’m voicebot. Tap the microphone and start talking to me.");

    this._appService.getScroll()
      .subscribe(item => {
        //this.Focus = false;
        if(item){
          this.scrollToBottom();
        }
      });

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

    // this._appService.getMicValue()
    //   .subscribe(item => {
    //     console.log("MicValue = "+item);
    //     if(!this.hideFooter) {
    //       this.sendMessage(item);
    //     }
    //     this.newMessage = '';
    //   });

    this._appService.getPlaceholder()
      .subscribe(item => {
        console.log("placeholder = "+item);
        this.placeholder = item;
      });

    this._appService.getLoading()
      .subscribe(item => {
        console.log("loading = "+item);
        this.loading = item;
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
            "SessionId":this._appService.getSessionId()
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
      console.log("Inside SendMessage");
      this.loading = true;
      console.log("before chat push = "+JSON.stringify(responseJson.response));
      this.chats.push(responseJson.response);
      this.method = this._appService.getMethod();
      console.log("method = "+this.method);
      this.intent = this._appService.getIntent();
      this.StateId = this._appService.getStateId();
      this.ResultingStateId = this._appService.getResultingStateId();
     // alert("Before sending the message StateId = "+this.StateId);
      this._appService.sendBotMessage(message , this.method , this.intent , this.StateId , this.ResultingStateId).subscribe(
        chatResponse => {
          // alert("received send Message");
          // alert(chatResponse.response.quick_replies);
          this.chats.push(chatResponse.response);
          this.loading = false;
          setTimeout(() => {
            this.scrollToBottom();
            this.newMessage = '';
          });
        },
        error => {
          console.log(error);
          this.loading = false;
          setTimeout(() => {
            this.scrollToBottom();
            this.newMessage = '';
          });
        }
      )
    }
  }

  chats:Array<any> = [];
}
