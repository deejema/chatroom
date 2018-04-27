import { Injectable } from '@angular/core';
import { ChatLine } from './chatline';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';

// Used for Http Requests
import { Observable } from 'rxjs/Observable'; // Class from RxJS library
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

/*
	Service that deals with chat-related functionality such as obtaining messages from the server
	and adding messages to the server
*/
@Injectable()
export class ChatService {
	cLog: ChatLine[]=[];
	private uri = 'http://localhost:3000/';
	//cLog: string[]=[];  // string ver
	
	username: string;
	constructor(private messageService: MessageService,
				private http: HttpClient) { }

	/* Get chat log from server */
	getLog(): Observable<any> {
		this.messageService.add('Getting chat');
		return this.http.get(`${this.uri}api/getchat`).map(res=> { return res});
		//return of(this.cLog);
		
	}

	/* Add a message to the chat log */
	addMessage(name: string, message: string) {
		const insertToChat = { username:name, content:message };
		return this.http.post(`${this.uri}api/add`, insertToChat)
			.subscribe(res => this.log(`Added "${name}: ${message} to chatlog"`));
		//this.cLog.push({ username: name, content: message}); // pushes ChatLine(username, content)
	}

	
	
	/*	Logs the user into the chatroom*/
	setUsername(name: string): void {
		this.username = name;
		this.log('Username \'' + this.username + '\': logged in');
	}
	
	/* Returns the username */
	getUsername(): string {
		this.log('Username \'' + this.username + '\':  registered in chat');
		return this.username;
	}
	
	/** Log a HeroService message with the MessageService */
	private log(message: string) {
		this.messageService.add('ChatService: ' + message);
	}
	
	/* // string ver
		getLog(): string[] {
		this.messageService.add('Getting chat');
		return this.cLog;
	}*/
	
		/* // string ver
	addMessage(name: string, message: string): void {
		this.log(`Added "${name}: ${message}"`);
		this.cLog.push(`${name}: ${message}`);
	}
	*/
	
}
