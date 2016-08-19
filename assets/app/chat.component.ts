import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked,
  Input, trigger, state, style, transition, animate } from '@angular/core';
import { Control } from '@angular/common';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ChatService } from './services/chat.service';

import { Message } from './message.model';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
  providers: [ChatService],
  animations: [
    trigger('slide', [
      state('inactive', style({
        transform: 'translateY(90%)',
        'min-height': '400px'
      })),
      state('active', style({
        transform: 'translateY(0%)'
      })),
      transition('inactive => active', [
        animate('100ms linear', style({ transform: 'translateY(90%)' }))
      ]),
      transition('active => inactive', [
        animate('100ms linear', style({ transform: 'translateY(0%)' }))
      ])
    ])
  ]
})
export class ChatComponent implements AfterViewChecked, OnInit, OnDestroy {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  messages = new Array;
  usernameCompleted = new Boolean;
  username = new String;
  state = new String;

  connection;
  messageModel: Message;

  constructor(private chatService: ChatService) {
    console.log('Constructing component');
    this.messageModel = new Message();
    this.usernameCompleted = false;
    this.state = 'inactive';
  }

  toggleOpen() {
    if (this.state === 'active') {
      this.state = 'inactive';
    } else {
      this.state = 'active';
    }
  }

  setUsername() {
    this.usernameCompleted = true;
    this.username = this.messageModel.username;
    console.log('message array in component:' + this.messages);
  }

  sendMessage() {
    console.log('username: ' + this.username);
    console.log('message from component send: ' + this.messageModel.message);
    this.chatService.sendMessage(this.messageModel.message, this.username);
    this.messageModel = new Message();
  }

  updateScrollPosition() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  emitTyping() {
    console.log(this.username + ' is typing');
    this.chatService.typing(this.username);
  }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      console.log('mesage in ngOnInit: ' + JSON.stringify(message));
      if (message) {
        this.messages.push(message);
      }
    })
  }

  ngAfterViewChecked() {
    this.updateScrollPosition();
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
