import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

/* 
	Adds a message to the chat log
*/
@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.css']
})
export class AddMessageComponent implements OnInit {
	username: string;
	
	// Define ChatService
	constructor(private chatService: ChatService) { }

	ngOnInit() {
		this.getUsername();
	}
	
	/* 
		Add message to the chat 
		Name may be removed from chat
	*/
	getUsername(): void {
		this.username = this.chatService.getUsername()
	}
	
	add(message: string): void {
		if(!this.username || !message) {return;}
		/*
			Name and Message should be sent to the chatService to be processed
		*/
		this.chatService.addMessage(this.username, message)
	}
}
