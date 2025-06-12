import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { ToastNotification } from '../media-finder/toast-notification';
import { UserProfileDialog } from '../user-profile-dialog/user-profile-dialog';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, MatDialogModule, ToastNotification],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  toastMessage = '';
  requireLogin = environment.requireLogin;
  profileMenu: any;
  constructor(private dialog: MatDialog) {}

  openProfileDialog() {
    if (!this.requireLogin) {
      this.toastMessage = 'Login is disabled';
      setTimeout(() => this.toastMessage = '', 2500);
      return;
    }
    this.dialog.open(UserProfileDialog);
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/';
  }
}
