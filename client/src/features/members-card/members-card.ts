import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../core/pipes/age-pipe';
import { LikesService } from '../../core/services/likes-service';
import { PresenceService } from '../../core/services/presence-service';

@Component({
  selector: 'app-members-card',
  imports: [RouterLink,AgePipe],
  templateUrl: './members-card.html',
  styleUrl: './members-card.css'
})
export class MembersCard {
protected likeService=inject(LikesService);
private presenceService=inject(PresenceService);
member=input.required<Member>();
hasLike=computed(()=>this.likeService.likeIds().includes(this.member().id));
protected isOnline=computed(()=>this.presenceService.onlineUsers().includes(this.member().id));

toggleLike(event:Event)
{
  event.stopPropagation();
  this.likeService.toggleLike(this.member().id)
}


}
