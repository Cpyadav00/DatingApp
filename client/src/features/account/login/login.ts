import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { Router } from '@angular/router';
import { TextInput } from '../../../shared/text-input/text-input';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
    private fb=inject(FormBuilder);
     protected loading=signal(false);
    private toast=inject(ToastService);
    protected accountService=inject(AccountService);
      private router=inject(Router);
 cancelLogin=output<boolean>();
 protected creds:any={};
  protected loginForm:FormGroup;
  protected validationErrors=signal<string[]>([]);
constructor() {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
  });
}

login() {
  if (this.loginForm.valid) {
    this.accountService.login(this.loginForm.value).subscribe({
    next: ()=>{
      this.router.navigateByUrl('/members');
      this.toast.success("Logged in successfully");
    this.creds={};
    },
    error: error=>{
      console.log(error);
    this.toast.error(error.error);
    },
    complete:()=>this.loading.set(false)
  })

  }
}

cancel() {
  this.cancelLogin.emit(false);
}

}
