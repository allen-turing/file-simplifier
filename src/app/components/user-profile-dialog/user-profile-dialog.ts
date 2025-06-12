import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-profile-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './user-profile-dialog.html',
  styleUrl: './user-profile-dialog.scss'
})
export class UserProfileDialog {
  name = '';
  password = '';

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.name = user.name || '';
  }

  save() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.name = this.name;
    localStorage.setItem('user', JSON.stringify(user));
    // Close dialog (handled by Angular Material)
  }
}
