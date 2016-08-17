import { Component, OnInit, OnDestroy } from '@angular/core';
import { Control }           from '@angular/common';
import { ChatService }       from './services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `<div *ngFor="let message of messages">
                     {{message.username}}: {{message.text}}
                   </div>
                   <input [(ngModel)]="message"  /><button (click)="sendMessage()">Send</button>
                   <input #user /><button (click)="setUsername(user.value)">Enter Username</button>

                   `,
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages = [];
  connection;
  message;
  username;

  constructor(private chatService: ChatService) {}

  setUsername(user) {
    this.username = user;
  }

  sendMessage() {
    this.chatService.sendMessage(this.message, this.username);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
      console.log(message);
    })
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
