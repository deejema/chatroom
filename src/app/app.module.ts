import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './/routing.module';

/* Components */
import { ChatWindowComponent } from './chat-window/chat-window.component';

import { AppComponent } from './app.component';

/* Services */
import { ChatService } from './chat.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { LoginComponent } from './login/login.component';

/* Http */
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    MessagesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
	FormsModule,
	HttpClientModule,
	HttpModule
  ],
  providers: [ChatService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
