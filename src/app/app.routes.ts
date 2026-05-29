import { Routes } from '@angular/router';
import { Welcome } from './welcome/welcome';
import { Mode1 } from './mode1/mode1';
import { Host } from './mode1/host/host';
import { Mode2 } from './mode2/mode2';
import { Error } from './error/error';
import { SessionMember } from './mode1/session-member/session-member';
import {SessionHost} from "./mode1/session-host/session-host";

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },

  { path: 'welcome', component: Welcome },
  { path: 'mode1', component: Mode1 },
  { path: 'mode2', component: Mode2 },

  { path: 'callback', component: Host },
  { path: 'mode1/configureSession', component: Host },
  { path: 'mode1/session-member/:sessionId', component: SessionMember },
  { path: 'mode1/session-host/:sessionId', component: SessionHost },

  { path: 'mode2/session-member', component: Mode2 },

  { path: '404', component: Error },
  { path: '**', redirectTo: '404' },
];