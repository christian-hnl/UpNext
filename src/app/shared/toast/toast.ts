import { Component, inject } from '@angular/core';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  private notifications = inject(NotificationService);

  toasts = this.notifications.toasts;

  dismiss(id: number): void {
    this.notifications.dismiss(id);
  }
}
