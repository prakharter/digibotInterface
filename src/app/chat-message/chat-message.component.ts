import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../app.service";
import {NguiOverlayManager} from "@ngui/overlay";
import {environment} from "../../environments/environment";
import { EmbedVideoService } from 'ngx-embed-video';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ControlType} from "../Interface/ControlType";

declare let jQuery: any;
declare let  responsiveVoice:any;

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {

  @Input() chat:any;
  typewriter_text: string = "";
  second_text:string = "";
  typewriter_display: string = "";
  second_display:string = "";
  afterTyped:boolean = false;
  afterTypedBorder:boolean = false;
  doType:boolean;
  youtubeUrl:any;
  StyleObject: Object = {};
  iframeUrl:string = '<iframe src="//www.youtube.com/embed/1uIzS1uCOcE&t" frameborder="0" allowfullscreen></iframe>';
  description: string = `It's a :rocket:`;

  constructor(private _appService:AppService  , public _overlayManager: NguiOverlayManager
  ,private embedService: EmbedVideoService , private _sanitizer: DomSanitizer) {
console.log("Inside constructor of Chat-Message");
    this.connection = this._appService.getMessagesfromServer().subscribe(message => {
      console.log("Message received from server = "+JSON.stringify(message));
      if(message['transaction_status'] === 1){
        this.isOpacity = true;
        this.isFrame = false;
        this._appService.getStateInformation(null,message['ResultingStateID'],'','','').subscribe(
          chatResponse => {
            console.log("response after transaction success"+chatResponse.response);
            this._appService.setChat(chatResponse.response);
            this._appService.emitLoading(false);
          },
          error => {
            console.log(error);
            this._appService.emitLoading(false);
          }
        )
      }
      else  if(message['transaction_status'] === 2){
        this.isOpacity = true;
        this.isFrame = false;
        this._appService.getStateInformation(null,message['ResultingStateID'],'','','').subscribe(
          chatResponse => {
            console.log("response after transaction declined "+chatResponse.response);
            this._appService.setChat(chatResponse.response);
            this._appService.emitLoading(false);
          },
          error => {
            console.log(error);
            this._appService.emitLoading(false);
          }
        )
      }
      else if(message['ClientId']!=null){
        this.SocketId = message['ClientId'];
      }
    });

    this.doType = true;
    this.youtubeUrl = "https://www.youtube.com/watch?v=1uIzS1uCOcE&t=8s";
  }

  getYoutubeUrl(url) {
    let videoUrl = this.getVIdeoURL(url);
    return this._sanitizer.bypassSecurityTrustHtml(videoUrl);
  }
  getVIdeoURL(url){
    console.log("Inside getVideoURL");
    console.log(url);
    //console.log(this.embedService.embed_youtube(url));
    return this.embedService.embed_youtube(url);
  }

  typingCallback(that , parts) {
    //console.log("doType before= "+this.doType);
    //that.typewriter_text = parts[0];
    let total_length = that.typewriter_text.length;
    let current_length = that.typewriter_display.length;
    if (current_length < total_length) {
      that.typewriter_display += that.typewriter_text[current_length];
    } else {
      //that.typewriter_display = "";
      that.doType = false;
      that.afterTyped = true;
      this.afterTypedBorder = true;
      setTimeout(function() {
        that.afterTyped = false;
      }, 2000)
      that._appService.emitScroll(true);
    }
    if(that.doType === true) {
      setTimeout(function() {
        that.typingCallback(that ,parts);
      }, 50)
      //setTimeout(that.typingCallback, 100, that);
    }
    else if(parts!=null){
      that.second_text = parts[1];
      that.doType = true;
      that.typingCallbackforSecond(that , parts );
    }
  }

  typingCallbackforSecond(that , parts) {
    let total_length = that.second_text.length;
    let current_length = that.second_display.length;
    if (current_length < total_length) {
      that.second_display += that.second_text[current_length];
    } else {
      //that.typewriter_display = "";
      that.doType = false;
      that.afterTyped = true;
      this.afterTypedBorder = true;
      setTimeout(function() {
        that.afterTyped = false;
      }, 2000)
      that._appService.emitScroll(true);
    }
    if(that.doType === true) {
      setTimeout(function() {
        that.typingCallbackforSecond(that ,parts);
      }, 50)
      //etTimeout(that.typingCallback, 100, that);
    }
    else {
     // that.typingCallbackforSecond(that , parts );
    }
  }

  starArray:any = [];
  isOverlay:boolean = false;
  isFrame:boolean = false;
  submittedValue:string = null;
  isOpacity:boolean = false;
  PAYMENT_WEB_URL:string = environment.PAYMENT_URL;
  showAttr:boolean = false;
  infiniteAnimation:boolean = true;
  quickReplySubmittedValue:string;
  connection;
  Arr:Array<number> = []; //Array type captured in a letiable
  ArrNumber:Array<number> = [];
  num:number = 0;
  color:string = 'red';
  beneficiary:any = {
    Name:'Uma Srivastava',
    Relationship:'Mother',
    AccountNumber:'118392922',
    Bank:'Rand merchant Bank',
    Amount:'100 Rands'
  }

  mouseOvered:Array<boolean> = [];
  changeStyle($event){
    this.color = $event.type == 'mouseover' ? 'yellow' : 'red';
  }

  messageClass:string = "col-9";
  ResponseResultingStateID:string;
  beneficiaryLength:Number = 0;
  beneficiaryArray:Array<any> = [];
  beneficiaryTitle:string;
  beneficiaryImage:string;
  WorkflowType:string;
 // audio = new Audio();
  ngOnChanges(changes) {
    console.log("Inside ngOnChanges");
    if(changes.chat) {
      console.log("Changes Chat = " + JSON.stringify(changes.chat));
      this.WorkflowType = changes.chat.currentValue.state.WorkflowType;
      if (changes.chat.currentValue.state.WorkflowType === 'beneficiary') {
        this.beneficiary = {
          Name: changes.chat.currentValue.beneficiaryDetails.Name,
          Relationship: changes.chat.currentValue.beneficiaryDetails.Relationship,
          AccountNumber: changes.chat.currentValue.beneficiaryDetails.AccountNumber,
          Bank: changes.chat.currentValue.beneficiaryDetails.Bank,
          Amount: changes.chat.currentValue.beneficiary.paymentCost + ' ' + changes.chat.currentValue.beneficiary.currencyCost
        };
        this.beneficiaryTitle = 'Pay Beneficiary';
        this.beneficiaryImage = "https://www.gedtestingservice.com/uploads/images/medium/0d461dd4af76877019784d29aa5e1c14.png";
      }
      else if (changes.chat.currentValue.state.WorkflowType === 'addBeneficiary') {
        this.beneficiary = {
          Name: changes.chat.currentValue.beneficiary.beneficiaryName,
          AccountNumber: changes.chat.currentValue.beneficiary.accountNumber,
          Bank: changes.chat.currentValue.beneficiary.bankName
        };
        this.beneficiaryTitle = 'Add Beneficiary';
        this.beneficiaryImage = "https://www.gedtestingservice.com/uploads/images/medium/0d461dd4af76877019784d29aa5e1c14.png";
      }
      else if (changes.chat.currentValue.state.WorkflowType === 'vehicleAccidentClaim') {
        let datetime = changes.chat.currentValue.beneficiary.datetime;
        this.beneficiary = {
          ClaimType: changes.chat.currentValue.beneficiary.carAccident,
          EventDate: datetime.substring(0, datetime.indexOf('T')),
          EventTime:datetime.substring(datetime.indexOf('T')+1 , datetime.indexOf('T')+6),
          EventPlace:changes.chat.currentValue.beneficiary.carAccidentPlace
        };
        this.beneficiaryTitle = 'Vehicle Insurance Claim';
        this.beneficiaryImage = "http://www.jmr.co.za/wp-content/uploads/2016/06/logo-momentum-tagline.png";

      }
      this.beneficiaryLength = Object.keys(this.beneficiary).length;
      console.log("beneficiary Length = " + this.beneficiaryLength);
      Object.keys(this.beneficiary).forEach(k => {
        console.log(k + " -" + this.beneficiary[k]);
        let beneficiaryObj = {
          Key: k,
          Value: this.beneficiary[k]
        };
        this.beneficiaryArray.push(beneficiaryObj);
      });

      this.ResponseResultingStateID = changes.chat.currentValue.state.ResultingStateID;
      console.log("ResponseResultingStateID = "+this.ResponseResultingStateID);
      console.log("BackgroundImgStyle = "+changes.chat.currentValue.state.BackgroundImgStyle)
      if(changes.chat.currentValue.state.BackgroundImgStyle!='' && changes.chat.currentValue.state.BackgroundImgStyle) {
        console.log("Inside backgroundImgStyle");
        this.StyleObject = JSON.parse(changes.chat.currentValue.state.BackgroundImgStyle);
        console.log("StyleObject = "+this.StyleObject);
      }

        if(changes.chat.currentValue.state.WorkflowType === 'dragonscrolls' || changes.chat.currentValue.state.WorkflowType === 'gameofthrones'){
          this.Arr = [12,34,76,89,23,67,98,22,45,76,19,77,34,84,23,56,92,73,68,12,78,45,88,97];
        }
        // else if(changes.chat.currentValue.state.WorkflowType === 'beneficiary'){
        //   this._appService.getBeneficiaryDetails().subscribe(message => {
        //
        //   })
        // }
      console.log("changes.chat.currentValue = "+JSON.stringify(changes.chat.currentValue.state));

      if(!changes.chat.currentValue.state.IsVoice)
      responsiveVoice.speak(changes.chat.currentValue.state.Message, "US English Female");
      if(changes.chat.currentValue.state.Message.indexOf("*") > 0){
        let parts = changes.chat.currentValue.state.Message.split('*');
        this.typewriter_text = parts[0];
        this.typingCallback(this , parts);

      }
      else {
        this.typewriter_text = changes.chat.currentValue.state.Message;
        this.typingCallback(this , null);
        this.chatMainMessage = changes.chat.currentValue.state.Message;
      }
      // this.youtubeUrl = this.embedService.embed("https://www.youtube.com/watch?v=1uIzS1uCOcE");
      console.log("embed videos = "+JSON.stringify(changes.chat.currentValue.embed_videos));
      console.log(changes.chat.currentValue.embed_videos == '');
      if(changes.chat.currentValue.embed_videos!='' && changes.chat.currentValue.embed_videos) {
        let url = changes.chat.currentValue.embed_videos[0].URL + "&output=embed";
       // this.youtubeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
        this.youtubeUrl = this.getYoutubeUrl(changes.chat.currentValue.embed_videos[0].URL);
      }
      if(changes.chat.currentValue.state.BotImg !=''){
        this.messageClass = "col-9";
      }
      else this.messageClass = "col-12";
    }
  }


  chatMainMessage:string;
  chatSecondMessage:string;

  getMainMessage(str) {
  let i = str.indexOf("*");

  if(i > 0){
    let firstStr =  str.slice(0, i);
    return (firstStr);
  }

  else{
    return null;
    }

}

  getStarMessage(str) {
    let i = str.indexOf("*");

    if(i > 0){
      let secondStr =str.substring(str.lastIndexOf("*")+1,str.lastIndexOf("*"));
      console.log("secondStr = "+secondStr);
      return (secondStr)
    }

    else{
      return null;
    }

  }

  ngOnInit() {
  console.log("Inside OnInit on CHat-message");
     this.starArray = this.range1(5);
    if(this.chat.controlType.length > 0)
      this.showAttr = true;


    this._appService.getOpacity()
      .subscribe(item => {
        console.log("opacity = "+item);
        this.isOpacity = item;
      });

    this._appService.getMinHeight()
      .subscribe(item => {
        console.log("MinHeight = "+item);
        this.chat.state.MinHeight = item;
      });
  }
  SocketId;

  ngOnDestroy() {
    console.log("Unsubscribe connection");
    this.connection.unsubscribe();

  }


  range1(i){
    let x=[];
    let j=1;
    while(x.push(j++)<i){};
    return x
  }
ResultingStateID:string;
newChat:any;
  formSubmitted(value , controlType , WorkflowType) {
    console.log("WorkflowType after form Submitted = "+WorkflowType);
    console.log("value after form Submitted = "+JSON.stringify(value));

    //this.audio.src = '';
    this._appService.emitMicValue('');
    this.submittedValue = value[WorkflowType];
    if(WorkflowType != 'payment')
    this.isOpacity = true;
    this.showAttr = false;
    this.ResultingStateID = controlType[0].ResultingStateID;
    this._appService.emitLoading(true);
    if(WorkflowType === 'payment'){
      console.log("Inside Payment SocketID = "+this.SocketId);
      this._appService.getPaymentInformation(value , this.SocketId).subscribe(
        chatResponse => {
          if(chatResponse.error){
            console.log(chatResponse.error);
            this.submittedValue = chatResponse.error;
            this.isOpacity = true;
            this._appService.emitLoading(true);
            console.log("error on Payment Resulting State = "+this.ResultingStateID);
            console.log("ResponseResultingStateID = "+this.ResponseResultingStateID);
            this._appService.getStateInformation(null,this.ResponseResultingStateID,'', '', '').subscribe(
              chatResponse => {
                console.log(chatResponse.response);
                this._appService.setChat(chatResponse.response);
                this._appService.emitLoading(false);
              },
              error => {
                console.log(error);
                this._appService.emitLoading(false);
              }
            )
            this.infiniteAnimation = false;
          }
          else {

            console.log("TOKEN = "+chatResponse.TOKEN);
            this.submittedValue = "Thank you for the information. You will be directed to 3D secure page to authenticate your transaction";
            //this._appService.setChat(chatResponse.response);
            this.PAYMENT_WEB_URL = this.PAYMENT_WEB_URL+chatResponse.TOKEN;
            this.isFrame = true;
          }

          this._appService.emitLoading(false);
        },
        error => {
          console.log(error);
          this._appService.emitLoading(false);
        }
      )

    }
    else if(WorkflowType != '' || WorkflowType !=null){
      console.log("WorkflowType is not null = "+WorkflowType );
      this._appService.getStateInformation(controlType ,controlType[0].ResultingStateID,'', value , WorkflowType).subscribe(
        chatResponse => {
          console.log(chatResponse.response);
          this._appService.setChat(chatResponse.response);
          this._appService.emitLoading(false);
        },
        error => {
          console.log(error);
          this._appService.emitLoading(false);
        }
      )
    }
    else {
      this._appService.getStateInformation(controlType, controlType[0].ResultingStateID,'','','').subscribe(
        chatResponse => {
          console.log(chatResponse.response);
          this._appService.setChat(chatResponse.response);
          this._appService.emitLoading(false);
        },
        error => {
          console.log(error);
          this._appService.emitLoading(false);
        }
      )
    }
  }
  showSpan:boolean = false
  showClickImageDesc:string = '';
  showDesc(event , image , bool){
  console.log("Inside showDesc = "+event);
  this.showClickImageDesc = image.ImageDesc;
  this.showSpan = bool;
  }

  startResponse(payload){
   // this.audio.src = '';
    console.log(payload.ResultingStateID);
    if(payload.ResultingStateID) {
      this.isOpacity = true;
      this._appService.emitLoading(true);
      this.quickReplySubmittedValue = payload.Text;
      this._appService.getStateInformation(null,payload.ResultingStateID,payload.Text, '', this.WorkflowType).subscribe(
        chatResponse => {
          console.log(chatResponse.response);
          this._appService.setChat(chatResponse.response);
          this._appService.emitLoading(false);
        },
        error => {
          console.log(error);
          this._appService.emitLoading(false);
        }
      )
      this.infiniteAnimation = false;
    }
    else {
      window.open(payload.URL, "_blank");
    }
  }

  ngAfterViewInit(): void {
    window.scroll(0,0);
  }

  private maxRateValue:number = 10;
  private overStar:number;
  private ratingPercent:number;



}
