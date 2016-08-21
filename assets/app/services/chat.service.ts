import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class ChatService {
  // private url = 'scfldevjp.summit.local:3000';
  private url = 'http://localhost:3000';
  private socket;

  sendMessage(message, username) {
    let obj = {
      message: message,
      username: username
    }
    console.log('obj from service in send: ' + JSON.stringify(obj));
    this.socket.emit('add-message', obj);
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        console.log('data from service: ' + data.message);
        observer.next(data.message);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getIsTyping() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('userTyping', (data) => {
        observer.next(data.username);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  typing(username) {
    this.socket.emit('typing', {username: username});
    this.socket.on
  }
}
