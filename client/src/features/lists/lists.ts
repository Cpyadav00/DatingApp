import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MembersCard } from '../members-card/members-card';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from "../../shared/paginator/paginator";

@Component({
  selector: 'app-lists',
  imports: [MembersCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {

  private likesService=inject(LikesService);
  protected pagtinatedResult=signal<PaginatedResult<Member> | null>(null);
  protected pageNumber=1;
  protected pageSize=5;
  protected predicate='liked';
 tabs=[
  {label:'Liked',value:'liked'},
  {label:'Liked me',value:'likedBy'},
  {label:'Mutual',value:'mutual'},
 ]

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate:string)
  {
    if(this.predicate !== predicate)
    {
      this.predicate=predicate;
      this.pageNumber=1;
      this.loadLikes();
    }
  }

  loadLikes()
  {
    this.likesService.getLikes(this.predicate,this.pageNumber,this.pageSize).subscribe({
      next:members=>this.pagtinatedResult.set(members)
    })
  }

  onPageChange(event:{pageNumber:number,pageSize:number})
  {
    this.pageSize=event.pageSize;
    this.pageNumber=event.pageNumber;
    this.loadLikes();
  }

}
