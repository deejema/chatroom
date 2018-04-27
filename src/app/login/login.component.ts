import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	constructor(private chatService: ChatService,
				private router: Router) { }

	ngOnInit() {
	}
	
	login(name: string) {
		this.chatService.setUsername(name);
		this.router.navigate['chat'];
		// Need a way to change page to /chat
	}
}
