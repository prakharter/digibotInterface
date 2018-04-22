import {Injectable, EventEmitter, Output} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import {ConfigurationService} from "./configuration/configuration";
import { HubConnection } from '@aspnet/signalr';
import {ControlType} from "./Interface/ControlType";
import {FormData} from "./Interface/FormData";

@Injectable()
export class AppService {

  private _hubConnection: HubConnection;
  public async: any;
  message = '';
  messages: string[] = [];


  constructor(private _http: Http , private _configurationService:ConfigurationService) {

    this._hubConnection = new HubConnection(this._configurationService.getURL()+'/SocketHub');

    this._hubConnection.start()
      .then(() => {
        console.log('Hub connection started')
        this.socketConnected = true;
      })
      .catch(() => {
        console.log('Error while establishing connection')
      });


    this._hubConnection.on('Send', (data: any) => {
      const received = `Received: ${data}`;
      this.messages.push(received);
    });



    this._hubConnection.on('OnConnected', (data: any) => {
      const received = `Connected Received: ${data}`;
      this.SocketId = data;
      console.log("SocketId = "+this.SocketId);
      //this.messages.push(received);
      console.log(received);
      this.emitStartFlow(true);
    });


  /*  this.socket.on('SocketID', (data) => {
      this.SocketId = data;
     console.log("SOCKETID = "+this.SocketId);
this.emitStartFlow(true);
    }); */


  }

  chats: EventEmitter<any> = new EventEmitter();
  scroll: EventEmitter<any> = new EventEmitter();
  footer: EventEmitter<any> = new EventEmitter();
  placeholder: EventEmitter<any> = new EventEmitter();
  opacity: EventEmitter<any> = new EventEmitter();
  StartFlow: EventEmitter<any> = new EventEmitter();
  MinHeight: EventEmitter<any> = new EventEmitter();
  method: string;
  StateId:string;
  ResultingStateId:string;
  intent:string;
  @Output() loading: EventEmitter<any> = new EventEmitter();
  private socket;
  SessionId:string;
  Mic:EventEmitter<any> = new EventEmitter();
  MicValue:EventEmitter<any> = new EventEmitter();
  private socketConnected:boolean = false;

  emitMinHeight(value){
    this.MinHeight.emit(value);
  }

  getMinHeight(){
    return this.MinHeight;
  }

  setChat(chat){
  this.chats.emit(chat);
}

setMethod(value){
    this.method = value;
}

  getMethod(){
    return this.method;
  }

  setStateId(value){
    this.StateId = value;
  }

  getResultingStateId(){
    return this.ResultingStateId;
  }

  setResultingStateId(value){
    this.ResultingStateId = value;
  }

  getStateId(){
    return this.StateId;
  }
  setIntent(value){
    this.intent = value;
  }

  getIntent(){
    return this.intent;
  }

  emitFooter(value){
  this.footer.emit(value);
}

  getFooter(){
  return this.footer;
}

  emitStartFlow(value){
    this.StartFlow.emit(value);
  }

  getStartFlow(){
    return this.StartFlow;
  }

  emitMic(value){
    this.Mic.emit(value);
  }

  getMic(){
    return this.Mic;
  }

  emitMicValue(value){
    this.MicValue.emit(value);
  }


  getMicValue(){
    return this.MicValue;
  }

  emitPlaceholder(value){
    this.placeholder.emit(value);
  }

  getPlaceholder(){
    return this.placeholder;
  }

  emitOpacity(value){
    this.opacity.emit(value);
  }

  getOpacity(){
    return this.opacity;
  }

  emitScroll(value){
  this.scroll.emit(value);
  }

  getScroll(){
  return this.scroll;
  }

  emitLoading(value) {
    this.loading.emit(value);
  }

  getLoading() {
    return this.loading;
  }

  getSessionId(){
    return this.SessionId;
  }
  private SocketId;
  getDefaultState(start:string , workflowId:string): Observable<any>{
    console.log("Inside getDefaultState");
    console.log(this.SocketId);
    let postData = {
      Session:start,
      Product:'DigiBot',
      WorkflowId:workflowId,
      ConnectionId:this.SocketId
    };
    console.log("GetDefaultState Post Data = "+JSON.stringify(postData));
    let responseJSON = this._http.post(this._configurationService.getURL() + '/api/State/GetDefaultState' , postData)
      .map((response: Response) => {
        console.log("Inside Map");
        console.log(response.json());
        if(response.json().response.state.Mic == 0){
          console.log("Mic is true = "+response.json().response.state.Mic);
          this.emitMic(true);
        }
        else {
          console.log("Mic is false = "+response.json().response.state.Mic);
          this.emitMic(false);
        }
        this.SessionId = response.json().response.SessionId;
        console.log("sessionId = "+this.SessionId);
        return response.json();
      })
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch(this.handleError);
    return responseJSON;
  }

  getStateInformation(ControlType:Array<ControlType> , ResultingStateID:string,Text:string,Formdata:any , WorkflowType:string): Observable<any>{
    console.log("Inside getStateInformation");
    console.log("Workflow Type = "+WorkflowType);
    console.log("New StateId = "+ResultingStateID);
    console.log("Previous StateId = "+this.StateId);
    let postData = {};
    let forms = Array<FormData>();
    if(WorkflowType!=''){


      for(let key in Formdata){
        if(Formdata.hasOwnProperty((key))){
          let form:FormData = {
            FormKey:key,
            FormValue:Formdata[key]
          };

          forms.push(form);
          console.log("Key = "+key);
          console.log("value = "+Formdata[key]);
          //console.log(key = " = "+Formdata[key]);
        }
      }
      console.log("Forms = "+forms);
      postData = {
        PreviousStateID:this.StateId,
        StateID:ResultingStateID,
        SessionID:this.SessionId,
        Forms:forms,
        WorkflowType:WorkflowType
      }
    } else {
      postData = {
        PreviousStateID:this.StateId,
        StateID:ResultingStateID,
        SessionID:this.SessionId,
        Text:Text
      };
    }
    console.log("PostData = "+JSON.stringify(postData));
    let responseJSON = this._http.post(this._configurationService.getURL() + '/api/State/GetStateInformation',postData)
      .map((response: Response) => {
      console.log("Workflow is equal to = "+response.json().response.state.WorkflowType);
      if(response.json().response.state.Mic == 1){
        console.log("Mic is 1 = "+response.json().response.state.Mic);
      this.emitMic(false);
      }
      else {
        console.log("Mic is 0 = "+response.json().response.state.Mic);
        this.emitMic(true);
      }
      console.log("Chat = "+response.json().response.state.Chat);
        if(response.json().response.state.Chat == 1){
          console.log("Workflow is chat");
          this.emitFooter(false);
          console.log("placeholder = "+ JSON.stringify(response.json().response.state));
          this.emitPlaceholder(response.json().response.state.Placeholder)
        }
        else {
          console.log("Workflow is Not chat");
          this.emitFooter(true);
        }
        return response.json();
      })
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch(this.handleError);
    return responseJSON;
  }

  getPaymentInformation(FormData:any , CLIENTID): Observable<any>{
    if(CLIENTID == "" || !CLIENTID)
      CLIENTID = this.SocketId;

    console.log("Final CLIENTID = "+CLIENTID);
    let postData = {
      CLIENTID:CLIENTID,
      COST:FormData.cost * 100,
      USER_FIRST_NAME: FormData.fullName,
      USER_EMAIL:FormData.email,
      CARD_NUMBER:FormData.cardNumber,
      CARD_EXPIRY_DATE:FormData.expiryMonth+FormData.expiryDate,
      CVV:FormData.cvv,
      SessionId:this.SessionId
    };
    console.log("inside getPayment Information");
    console.log(postData);
    let responseJSON = this._http.post(this._configurationService.getURL() + '/getWebsitePaymentToken',postData)
      .map((response: Response) => {
        console.log("Inside Map");
        console.log(response.json());
         if(!response.json().TOKEN){
          return {
            error:response.json().PAYMENT_RESULT_DESCRIPTION[0]
          }
        }
        else {
          return response.json();
        }

      })
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch(this.handleError);
    return responseJSON;
  }

  getMessagesfromServer() {
console.log("get messages from server");
    let observable = new Observable(observer => {
      this._hubConnection.on('message', (data: any) => {
        console.log("data from server = "+JSON.stringify(data));
        observer.next(data);
      });
    });
    return observable;
  }

   ReceiveCCCChat(): Observable<any>{

    let observable = new Observable(observer => {
      this._hubConnection.on('ReceiveCCCChat', (data: any) => {
        console.log("data from server = "+JSON.stringify(data));
        observer.next(data);
      });
    });
    return observable;
  }

  getBeneficiaryDetails(): Observable<any>{
    let postData = {
      SessionId:this.SessionId
    };
    let responseJSON = this._http.post(this._configurationService.getURL() + '/getBeneficiaryDetails' , postData)
      .map((response: Response) => {
        console.log("Inside Map");
        console.log(response.json());
        if(response.json().response.state.WorkflowType === 'Chat'){
          console.log("Workflow is chat");
          this.emitFooter(false);
          console.log("placeholder = "+ JSON.stringify(response.json().response.state));
          this.emitPlaceholder(response.json().response.state.Placeholder)
        }
        else {
          console.log("Workflow is Not chat");
          this.emitFooter(true);
        }
        return response.json();
      })
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch(this.handleError);
    return responseJSON;
  }

  sendBotMessage(message:string , method:string , intent:string , StateId:string , ResultingStateId:string): Observable<any>{
    //alert("Inside SendBotMessage");
    let postData = {
      SessionId:this.SessionId,
      Method:method,
      Question:message,
      Intent:intent,
      StateId:StateId,
      ResultingStateId:ResultingStateId
    };
    //alert("after post data");
    let responseJSON = this._http.post(this._configurationService.getURL() + '/api/State/SendMessage' , postData)
      .map((response: Response) => {
        // alert("Inside Map");
        // alert(response.json());
        if(response.json()!="OK"){
          if(response.json().response.state.Mic == 1){
           // alert("Mic is 1 = "+response.json().response.state.Mic);
            this.emitMic(false);
          }
          else {
           // alert("Mic is 0 = "+response.json().response.state.Mic);
            this.emitMic(true);
          }
          if(response.json().response.state.Chat == 1){
            //alert("Workflow is chat");
            this.emitFooter(false);
            //alert("placeholder = "+ JSON.stringify(response.json().response.state));
            this.emitPlaceholder(response.json().response.state.Placeholder)
          }
          else {
            //alert("Workflow is Not chat");
            this.emitFooter(true);
          }
        }

        return response.json();
      })
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch(this.handleError);
    return responseJSON;
  }

  private handleError(error: Response) {
    console.log(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
