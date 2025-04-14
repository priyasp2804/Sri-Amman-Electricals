import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-owner-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './owner-login.component.html',
  styleUrls: ['./owner-login.component.css']
})
export class OwnerLoginComponent implements OnInit {
  ownerExists = false;
  isFirstTime = true;
  errorMessage = '';

  registerForm: FormGroup;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.required, Validators.email]],
      loginPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.checkOwnerExists().subscribe({
      next: (res) => {
        this.ownerExists = res.exists;
        this.isFirstTime = !this.ownerExists;
      },
      error: () => {
        this.errorMessage = 'Server error. Please try again later.';
      }
    });
  }

  // ✅ Define this at the class level, not inside loginOwner()
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  registerOwner() {
    if (this.registerForm.invalid) return;

    const formData = this.registerForm.value;
    delete formData.confirmPassword; // Optional: don't send confirmPassword to backend

    this.authService.registerOwner(formData).subscribe({
      next: () => {
        this.ownerExists = true;
        this.isFirstTime = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed.';
      }
    });
  }

  loginOwner() {
    if (this.loginForm.invalid) return;
  
    const credentials = {
      email: this.loginForm.value.loginEmail,
      password: this.loginForm.value.loginPassword
    };
  
    this.authService.loginOwner(credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'owner');
        localStorage.setItem('name', res.owner.name);
        localStorage.setItem('email', res.owner.email);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid credentials';
      }
    });
  }
    
}
