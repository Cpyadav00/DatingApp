import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule,RouterLink,RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  private router=inject(Router);
  protected accountService=inject(AccountService);
  private toast=inject(ToastService);
 protected creds:any={};

 login()
 {
  this.accountService.login(this.creds).subscribe({
    next: ()=>{
      this.router.navigateByUrl('/members');
      this.toast.success("Logged in successfully");
    this.creds={};
    },
    error: error=>{
      console.log(error);
     this.toast.error(error.error);
    }
  })
 }

 logOut()
 {
  this.accountService.logOut();
  this.router.navigateByUrl('/');
 }

}
