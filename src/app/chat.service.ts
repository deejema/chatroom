import { Injectable, Inject } from '@angular/core';
import { ChatLine } from './chatline';
import { MessageService } from './message.service';

// Used for Http Requests
import { Observable } from 'rxjs/Observable'; // Class from RxJS library
import { of } from 'rxjs/observable/of';
import { Http, Headers, Request } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import * as Parse from 'parse';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
const httpOptions = {
	headers: new HttpHeaders({ 
		'Content-Type': 'application/json',
		'X-Parse-Application-Id': "12345",
		'X-Parse-Master-Key': "masterkey" })
};


// Used for bidirectional communication - used for updating client when server is updated
import * as io from 'socket.io-client';



/*
	Service that deals with chat-related functionality such as obtaining messages from the server
	and adding messages to the server
*/
@Injectable()
//@Inject(HttpClient)
export class ChatService {
	
	cLog: ChatLine[]=[];
	private uri = 'https://desolate-bayou-57447.herokuapp.com/parse/';
	//private uri = 'https://desolate-bayou-57447.herokuapp.com/';
	//private uri = 'http://localhost:3000/';
	//cLog: string[]=[];  // string ver
	private socket;
	username: string;
	private credientalHeaders: HttpHeaders; 
	private subscription;
	
	constructor(private messageService: MessageService,
				private http: HttpClient) { 
		

		this.credientalHeaders = new HttpHeaders({
		  'X-Parse-Application-Id': "12345",
		  'X-Parse-Master-Key': "masterkey"
		});
				
	}
	
	/** Initializes Live Query Client, detects to see if subscription is successful */
	initLiveQuery(): void {
		// Initialize LiveQuery Client
		var Parse = require('parse');
		Parse.initialize("12345", 'abs', "masterkey");
		Parse.serverURL = 'https://desolate-bayou-57447.herokuapp.com/parse';

		// Subscription
		let query = new Parse.Query('chat');
		this.subscription = query.subscribe();
		console.log ("Subscription Attempted")
		
		this.subscription.on('open', function(obj) {
				console.log('Subscription opened from client');
		});		

	}
	
	/** Gets another user's message when server creates */
	getLiveQueryMessage(): Observable<ChatLine> {
		return new Observable<ChatLine>(obs => {
			this.subscription.on('create', (data) => {\
				
				console.log(data.attributes); // Displays attribute in console
				
				// Pushes chatline to subscription
				obs.next({username: data.get("username"), content:data.get("content")});
			});
		});
	}

	

	
	/** Get chat log from server */
	getChatFromServer() : Observable<ChatLine[]> {
		return this.http.get<ChatLine[]>(`${this.uri}classes/chat`, { headers: this.credientalHeaders })
			.pipe(
				tap(chatlog=>this.log(JSON.stringify(chatlog))),
				catchError(this.handleError('getChatFromServer',[])));
	}

	//curl -X GET -H "X-Parse-Application-Id: 12345"  -H "X-Parse-Master-Key: masterkey}" -H "Content-Type: application/json" https://desolate-bayou-57447.herokuapp.com/parse/hooks/triggers
	
	/** Add a message to the chat log */
	addMessage(name: string, message: string): Observable<any> {
		let insertToChat = { username: name, content: message};
		return this.http.post<ChatLine>(`${this.uri}classes/chat`, insertToChat, httpOptions)
			.pipe(
				//tap((chatlog:ChatLine) => this.log(`Adding ${name}: ${message}`)),
				tap((chatlog:ChatLine) => {
					//this.socket.emit('new-message',`${name}: ${message}`);
					this.log(`Added ${name}: ${message}`);
				}),
				catchError(this.handleError('addMessage'))
		);
	}
	
	/**	Logs the user into the chatroom */
	setUsername(name: string): void {
		this.username = name;
		this.log('Username \'' + this.username + '\': logged in');
	}
	
	/** Returns the username and emits a broadcast to the socket server */
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
	
	//---------------------------------------------------------------------------
	/* Defunct Functions: Keep for reference*/
	/** Initialize socket for socket io - Called by chat-window */
	initSocket(): void {
		// This prompts 'user connected' for console in server.js when service is active
		this.socket = io(this.uri); 
	}
	
	/** Gets message from broadcast emitted */
	getSocketMessage(): Observable<ChatLine> { 
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
	/** Sends user message to server*/
	addSocketMessage(name: string, message: string): Observable<any> {
		let insertToChat = { username: name, content: message};
		return this.http.post("/server/chat", JSON.stringify(insertToChat), httpOptions)
		.pipe(
				//tap((chatlog:ChatLine) => this.log(`Adding ${name}: ${message}`)),
				tap((chatlog:ChatLine) => {
					//this.socket.emit('new-message',`${name}: ${message}`);
					this.log(`Added ${name}: ${message}`);
				}),
				catchError(this.handleError('addMessage'))
			);
			//.subscribe(res => this.log(`Added "${name}: ${message} to chatlog"`));
		//this.cLog.push({ username: name, content: message}); // pushes ChatLine(username, content)
	}
	
	/** Gets log when chat gets updated*/
	getLog(): Observable<ChatLine[]> {
		return new Observable<ChatLine[]>(observer => {
			this.socket.on('updateChat', (data) => observer.next(data));
		});
		
	}
	//---------------------------------------------------------------------------
	
	
}
