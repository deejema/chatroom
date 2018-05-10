import { Injectable } from '@angular/core';
import { ChatLine } from './chatline';
import { MessageService } from './message.service';

// Used for Http Requests
import { Observable } from 'rxjs/Observable'; // Class from RxJS library
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// Used for bidirectional communication - used for updating client when server is updated
import * as io from 'socket.io-client';

/*
	Service that deals with chat-related functionality such as obtaining messages from the server
	and adding messages to the server
*/
@Injectable()
export class ChatService {
	cLog: ChatLine[]=[];
	private uri = 'https://desolate-bayou-57447.herokuapp.com/parse/';
	//private uri = 'http://localhost:3000/';
	//cLog: string[]=[];  // string ver
	private socket;
	username: string;
	constructor(private messageService: MessageService,
				private http: HttpClient) { 

	}
	initSocket(): void {
		// This prompts 'user connected' for console in server.js when service is active
		this.socket = io(this.uri); 
	}
	getMessage(): Observable<ChatLine> { 
		return new Observable<ChatLine>(observer => {
		this.socket.on('updateChat', (data) => {
				/*	convert data String into a ChatLine object */
				let res = data.split(':');
				let name = res[0]; // save name 
				res.shift(); // pop first element in res
				let message = res.join(':'); // save content, merges array together if more than one ":" exists
				observer.next({username: name, content: message});
			});
		});
	}
	
	/* Get chat log from server */
	getLog(): Observable<ChatLine[]> {
		return new Observable<ChatLine[]>(observer => {
			this.socket.on('updateChat', (data) => observer.next(data));
		});
		// send an indiviual message and just append locally, no need to get ENTIRE chat log every time
		
		/*this.socket.on('updateChat', (message) => {
			console.log(message);
			return this.getChatFromServer();
		});
		
		console.log('did not update from socket');
		return this.getChatFromServer();
		*/
		
		/*return Observable.create((observer) => {
				this.socket.on('updateChat', (message) => {
					return this.getChatFromServer();
				});
		});*/			
		/*return this.http.get<ChatLine[]>(`${this.uri}api/getchat`)
			.pipe(
				tap(chatlog=>this.log('Getting chat')),
				catchError(this.handleError('getLog',[])));
		//.map(res=> { return res});
		//return of(this.cLog);
		*/
	}
	getChatFromServer() : Observable<ChatLine[]> {
		return this.http.get<ChatLine[]>(`${this.uri}getchat`)
			.pipe(
				tap(chatlog=>this.log('Getting chat')),
				catchError(this.handleError('getLog',[])));
	}

	/* Add a message to the chat log */
	/* PROBLEM: Return type Observable<any> allows build to work, but it does not properly call the data	
		back;  The data sent to the server does not properly get called as a ChatLine object and
		this.log() does not work.  When the data is subscribed back to the component, it will improperly
		add the field into the chat log and needs to be refreshed to see the correct chat
	*/ 
	/* 	Observable<ChatLine> brings the error:
			ERROR in src/app/chat.service.ts(41,3): error TS2322: Type 'Observable<{} | ChatLine>' is not assignable to type 'Observable<ChatLine>'.
				Type '{} | ChatLine' is not assignable to type 'ChatLine'.
					Type '{}' is not assignable to type 'ChatLine'.
						Property 'username' is missing in type '{}'.
						
		
	*/
	addMessage(name: string, message: string): Observable<any> {
		let insertToChat = { username: name, content: message};
		return this.http.post<ChatLine>(`${this.uri}add`, insertToChat, httpOptions)
			.pipe(
				//tap((chatlog:ChatLine) => this.log(`Adding ${name}: ${message}`)),
				tap((chatlog:ChatLine) => {
					this.socket.emit('new-message',`${name}: ${message}`);
					this.log(`Added ${name}: ${message}`);
				}),
				catchError(this.handleError('addMessage'))
			);
			//.subscribe(res => this.log(`Added "${name}: ${message} to chatlog"`));
		//this.cLog.push({ username: name, content: message}); // pushes ChatLine(username, content)
	}

	
	
	/*	Logs the user into the chatroom */
	setUsername(name: string): void {
		this.username = name;
		this.log('Username \'' + this.username + '\': logged in');
	}
	
	/* Returns the username and emits a broadcast to the socket server */
	getUsername(): string {
		this.log('Username \'' + this.username + '\':  registered in chat');
		return this.username;
		
	}
	
	/**
	* Handle Http operation that failed.
	* Let the app continue.
	* @param operation - name of the operation that failed
	* @param result - optional value to return as the observable result
	*/
	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
	 
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
		 
			// TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.message}`);
		 
			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
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
