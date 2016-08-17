import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked,
  Input, trigger, state, style, transition, animate } from '@angular/core';
import { Control }           from '@angular/common';
import { ChatService }       from './services/chat.service';

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
  messages = [];
  usernameCompleted: boolean = false;
  connection;
  messageModel: Message;
  state: string = 'inactive'

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private chatService: ChatService) {
    this.messageModel = new Message();
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
    console.log('message array in component:' + this.messages);
  }

  sendMessage() {
    console.log('message from component send: ' + this.messageModel.message);
    this.chatService.sendMessage(this.messageModel.message, this.messageModel.username);
    this.messageModel.message = '';
  }

  updateScrollPosition() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
      console.log(message);
    })
  }
  ngAfterViewChecked() {
    this.updateScrollPosition();
  }


  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
