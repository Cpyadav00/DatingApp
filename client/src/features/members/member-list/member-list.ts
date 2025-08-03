import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Observable } from 'rxjs';
import { Member, MemberParams } from '../../../types/member';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MembersCard } from '../../members-card/members-card';
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MembersCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  protected memberParams = new MemberParams();
  private updatedParams=new MemberParams();
  private memberService = inject(MemberService);
  protected PaginatedMembers = signal<PaginatedResult<Member> | null>(null);

  constructor()
  {
    const filters=localStorage.getItem('filters');
    if(filters) 
      {
        this.memberParams=JSON.parse(filters);
        this.updatedParams=JSON.parse(filters);
      }
  }
  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.PaginatedMembers.set(result);
      }
    })
  }
  OnPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();
  }

  onClose() {
    console.log("Modal close");
  }

  onFilterChange(data: MemberParams) {
   // this.memberParams = data; 
   // we are not using this because it is assigning the same reference to both the
   //  valiable insted will use {...data} because it will create new copy of the data and assign the value
   this.memberParams = {...data};  
   this.updatedParams={...data};
    this.loadMembers();
  }
  resetFilters() {
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();
    this.loadMembers();
  }

  get displayMessage()
  {
    const defaultParams=new MemberParams();
    const filters:string[]=[];
    if(this.updatedParams.gender)
    {
      filters.push(this.updatedParams.gender+'s');
    }else{
      filters.push('Males,Females');
    }
    if(this.updatedParams.minAge !== defaultParams.minAge || this.updatedParams.maxAge!==defaultParams.maxAge)
    {
      filters.push(` ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`)
    }
    filters.push(this.updatedParams.orderBy ==='lastActive' ? 'Recently active' : 'Newest members');

    return filters.length>0 ? `Selected: ${filters.join('  | ')}`:'All Members';
  }

}
