import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { Observable, of } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
private likeService=inject(LikesService)
  private accountService=inject(AccountService);
  init(){
    const userString=localStorage.getItem('user');
    if(!userString) return of(null);
    const user=JSON.parse(userString);
    this.accountService.currectUser.set(user);
    this.likeService.getLikeIds();
    return of(null)
  }
  
}
