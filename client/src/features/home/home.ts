import { Component, Input, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { User } from '../../types/user';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  @Input({required:true}) membersFromApp:User[]=[];
protected registerMode=signal(false);

showRigster(value:boolean)
{
  this.registerMode.set(value);
}
}
