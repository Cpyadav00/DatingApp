import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { MembersCard } from '../../members-card/members-card';

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe,MembersCard],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList {
private memberService=inject(MemberService);
protected members$:Observable<Member[]>;
constructor()
{
  this.members$=this.memberService.getMembers();
}




}
