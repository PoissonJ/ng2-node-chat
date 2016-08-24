import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked,
  Input, trigger, state, style, transition, animate, Renderer } from '@angular/core';
import { Control } from '@angular/common';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import * as io from 'socket.io-client';

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
        transform: 'translateY(90.2%)', // Lol
        'min-height': '400px'
      })),
      state('active', style({
        transform: 'translateY(5%)'
      })),
      transition('inactive => active', [
        animate('100ms linear', style({ transform: 'translateY(90.2%)' }))
      ]),
      transition('active => inactive', [
        animate('100ms linear', style({ transform: 'translateY(5%)' }))
      ])
    ])
  ]
})
export class ChatComponent implements AfterViewChecked, OnInit, OnDestroy {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('myInput') private inputElement;

  messages = new Array;
  usernameCompleted = new Boolean;
  username = new String;
  state = new String;

  messageConnection;
  isTypingConnection;
  messageModel: Message;

  constructor(private chatService: ChatService, private renderer: Renderer) {
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
  }

  sendMessage() {
    this.chatService.sendMessage(this.messageModel.message, this.username);
    this.messageModel = new Message();
  }

  updateScrollPosition() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  emitTyping() {
    // console.log(this.username + ' is typing');
    this.chatService.typing(this.username);
  }

  ngOnInit() {
    this.messageConnection = this.chatService.getMessages().subscribe(message => {
      console.log('mesage in ngOnInit: ' + JSON.stringify(message));
      if (message) {
        this.messages.push(message);
      }
    });

    this.isTypingConnection = this.chatService.getIsTyping().subscribe(username => {
      // console.log('mesage in ngOnInit: ' + JSON.stringify(username));
      if (username) {
        // this.messages.push(username);
        console.log(username + ' is typing...');
      }
    });
  }

  ngAfterViewChecked() {
    this.updateScrollPosition();
    this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus');
  }

  ngOnDestroy() {
    this.messageConnection.unsubscribe();
    this.isTypingConnection.unsubscribe();
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus');
  }
}
