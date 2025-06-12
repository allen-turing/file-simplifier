import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  isSignup = false;
  email = '';
  password = '';
  name = '';

  constructor(private router: Router) {}

  toggleMode() {
    this.isSignup = !this.isSignup;
  }

  onSubmit() {
    // Simulate login/signup logic
    if (this.email && this.password && (!this.isSignup || this.name)) {
      // Save user info to localStorage (for demo)
      localStorage.setItem('user', JSON.stringify({
        email: this.email,
        name: this.isSignup ? this.name : 'User'
      }));
      this.router.navigate(['/home']);
    }
  }
}
