import { Component, inject, Input, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { User } from '../../types/user';
import { AccountService } from '../../core/services/account-service';
import { Login } from "../account/login/login";

@Component({
  selector: 'app-home',
  imports: [Register, Login],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  @Input({required:true}) membersFromApp:User[]=[];
protected registerModal=signal(false);
protected loginModal=signal(false);
protected accountService=inject(AccountService);

showRigster(value:boolean)
{
  this.registerModal.set(value);
}

showLogin(value:boolean)
{
 this.loginModal.set(value);
}

}
