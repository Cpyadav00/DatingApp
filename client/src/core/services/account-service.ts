import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private likeService=inject(LikesService);
  private http=inject(HttpClient);
 currectUser=signal<User | null>(null);
  private baseUrl=environment.apiUrl;

register(creds:RegisterCreds){
return this.http.post<User>(this.baseUrl+'account/register',creds, {withCredentials:true}).pipe(
      tap(user=>{
        if(user){
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    )
}
  login(creds:LoginCreds)
  {
    return this.http.post<User>(this.baseUrl+'account/login',creds,{withCredentials:true}).pipe(
      tap(user=>{
        if(user){
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    )
  }

  refreshToken(){
    return this.http.post<User>(this.baseUrl+'account/refresh-token',{},{withCredentials:true});
  }

  startTokenRefreshInterval()
  {
    setInterval(()=>{
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, { withCredentials: true }).subscribe({
      next:user=>{
        this.setCurrentUser(user);
      },
      error:()=>{
        this.logOut();
      }
    })
    },5*60*1000)
  }

  setCurrentUser(user:User){
    user.roles=this.getRolesFromToken(user);
 this.currectUser.set(user);
 this.likeService.getLikeIds();
  }

  logOut(){
    localStorage.removeItem('filters');
    this.likeService.clearLikeIds();
    this.currectUser.set(null);
  }

  private getRolesFromToken(user:User):string[]
  {
  const payload =user.token.split('.')[1];
  const decoded =atob(payload);
  const jsonPlayload=JSON.parse(decoded);
  return Array.isArray(jsonPlayload.role)?jsonPlayload.role:[jsonPlayload.role];
  }

}
