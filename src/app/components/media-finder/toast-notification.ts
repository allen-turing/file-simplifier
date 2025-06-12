import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="toast-notification">
      <div class="toast-message">
        <ng-container *ngIf="message.startsWith('Saved')">
          <mat-icon class="success-icon">check_circle</mat-icon>
        </ng-container>
        {{ message }}
      </div>
      <button mat-icon-button class="close-btn" (click)="close.emit()">
        <mat-icon class="close-icon">close</mat-icon>
      </button>
    </mat-card>
  `,
  styles: [`
    .toast-notification {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 320px;
      max-width: 90vw;
      z-index: 2000;
      background: #232226;
      color: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 22px 32px 18px 28px;
      font-size: 1.12rem;
      font-weight: 500;
      gap: 18px;
      animation: fadeIn 0.3s;
    }
    .toast-message {
      flex: 1;
      margin-right: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .success-icon {
      color: #4caf50;
      font-size: 2rem;
      vertical-align: middle;
    }
    .close-btn {
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      margin-left: 8px;
      padding: 0;
    }
    .close-icon {
      color: #ff1744;
      font-size: 2rem;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translate(-50%, -60%); }
      to { opacity: 1; transform: translate(-50%, -50%); }
    }
  `]
})
export class ToastNotification {
  @Input() message = '';
  @Output() close = new EventEmitter<void>();
}
