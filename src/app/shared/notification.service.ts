import { Injectable, signal } from '@angular/core';

export type ToastKind = 'error' | 'success' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

/**
 * App-wide, user-facing notifications. Components push messages here instead of
 * using alert()/console; the <app-toast> component renders them. State is a
 * signal, so the UI updates automatically.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;

  /** Currently visible toasts. */
  readonly toasts = signal<Toast[]>([]);

  error(text: string): void {
    this.show('error', text);
  }

  success(text: string): void {
    this.show('success', text);
  }

  info(text: string): void {
    this.show('info', text);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(kind: ToastKind, text: string): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, kind, text }]);
    // auto-dismiss after a few seconds
    setTimeout(() => this.dismiss(id), 5000);
  }
}
