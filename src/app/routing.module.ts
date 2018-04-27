import { NgModule } from '@angular/core';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';

/*
	Module keeps track of routes
*/

const routes: Routes = [
// path: string that matches URL in browser address bar, 
// component: component that the router should create when navigating to this route
	{ path: 'chat', component: ChatWindowComponent },
	{ path: 'login', component: LoginComponent },
	{ path: '',redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
	RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class RoutingModule { }
