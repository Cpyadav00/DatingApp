import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http=inject(HttpClient);
 currectUser=signal<User | null>(null);
  private baseUrl=environment.apiUrl;

register(creds:RegisterCreds){
return this.http.post<User>(this.baseUrl+'account/register',creds).pipe(
      tap(user=>{
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
}

  login(creds:LoginCreds)
  {
    return this.http.post<User>(this.baseUrl+'account/login',creds).pipe(
      tap(user=>{
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user:User){
 localStorage.setItem('user',JSON.stringify(user));
 this.currectUser.set(user);
  }

  logOut(){
    localStorage.removeItem('user');
    this.currectUser.set(null);
  }

}
