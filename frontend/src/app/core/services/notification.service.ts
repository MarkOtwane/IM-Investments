import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string, duration: number = 4000): void {
    this.showNotification({ message, type: 'success', duration });
  }

  showError(message: string, duration: number = 4000): void {
    this.showNotification({ message, type: 'error', duration });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.showNotification({ message, type: 'info', duration });
  }

  showWarning(message: string, duration: number = 3000): void {
    this.showNotification({ message, type: 'warning', duration });
  }

  private showNotification(notification: Notification): void {
    this.notificationSubject.next(notification);
    
    // Auto-dismiss after duration
    if (notification.duration) {
      setTimeout(() => {
        this.dismiss();
      }, notification.duration);
    }
  }

  dismiss(): void {
    this.notificationSubject.next(null);
  }

  getCurrentNotification(): Notification | null {
    return this.notificationSubject.value;
  }
}
