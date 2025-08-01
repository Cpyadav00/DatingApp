import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink,RouterLinkActive,RouterOutlet,AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit{
 private accountService=inject(AccountService);
 protected memberService=inject(MemberService);
  private route=inject(ActivatedRoute);
  private router=inject(Router);
 protected title=signal<string | undefined>('Profile');
 protected isCurrentUser=computed(()=>{
  return this.accountService.currectUser()?.id===this.route.snapshot.paramMap.get('id');
 })

  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot?.title)

    this.router.events.pipe(
      filter(event=>event instanceof NavigationEnd)
    ).subscribe({
      next:()=>{
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }

}
