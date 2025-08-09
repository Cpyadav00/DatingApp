import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { Observable, of, tap } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
private likeService=inject(LikesService)
  private accountService=inject(AccountService);
  init(){
   return this.accountService.refreshToken().pipe(
    tap(user=>{
      if(user) {
    this.accountService.setCurrentUser(user);
    this.accountService.startTokenRefreshInterval();
      }
    })
   )
  }
  
}
