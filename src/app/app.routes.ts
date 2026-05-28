import { Routes } from '@angular/router';
import { Welcome } from './welcome/welcome';
import { Mode1 } from './mode1/mode1';
import { Host } from './mode1/host/host';
import { Mode2 } from './mode2/mode2';
import { Error } from './error/error';
import { Session } from './mode1/session/session';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: Welcome },
  { path: 'mode1', component: Mode1 },
  { path: 'mode1/session/:sessionId', component: Session },
  { path: 'mode1/host', component: Host },
  { path: 'mode2/session', component: Mode2 },
  { path: 'callback', component: Host },
  { path: '404', component: Error },
  { path: '**', redirectTo: '404' },
];