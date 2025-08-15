import { Component, inject, OnInit, signal, ViewChild, HostListener } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../types/member';
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
  private updatedParams = new MemberParams();
  private memberService = inject(MemberService);

  protected PaginatedMembers = signal<PaginatedResult<Member> | null>(null);

  // Mobile handling
  protected isMobileView = window.innerWidth < 640;
  protected mobilePageSize = 6;
  protected mobileTotalPages = 0;

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }
  }

  @HostListener('window:resize')
  onResize() {
    const newIsMobile = window.innerWidth < 640;
    if (newIsMobile !== this.isMobileView) {
      this.isMobileView = newIsMobile;
      // Ensure page size matches the view
      this.memberParams.pageSize = this.isMobileView ? this.mobilePageSize : new MemberParams().pageSize;
      this.loadMembers();
    }
  }

  ngOnInit(): void {
    if (this.isMobileView) {
      this.memberParams.pageSize = this.mobilePageSize;
    }
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.PaginatedMembers.set(result);

        // Compute mobile total pages in TS (avoid Math.ceil in template)
        const meta = (result as any).metaData ?? (result as any).metadata;
        if (meta?.totalCount != null) {
          this.mobileTotalPages = Math.ceil(meta.totalCount / this.mobilePageSize);
        }

        // Keep page size forced to 6 on mobile
        if (this.isMobileView) {
          this.memberParams.pageSize = this.mobilePageSize;
        }
      }
    });
  }

  OnPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = this.isMobileView ? this.mobilePageSize : event.pageSize;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();
  }

  onClose() {
    console.log("Modal close");
  }

  onFilterChange(data: MemberParams) {
    this.memberParams = { ...data };
    this.updatedParams = { ...data };

    if (this.isMobileView) {
      this.memberParams.pageSize = this.mobilePageSize;
    }
    this.loadMembers();
  }

  resetFilters() {
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();

    if (this.isMobileView) {
      this.memberParams.pageSize = this.mobilePageSize;
    }
    this.loadMembers();
  }

  get displayMessage() {
    const defaultParams = new MemberParams();
    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(this.updatedParams.gender + 's');
    } else {
      filters.push('Males,Females');
    }
    if (this.updatedParams.minAge !== defaultParams.minAge || this.updatedParams.maxAge !== defaultParams.maxAge) {
      filters.push(` ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`);
    }
    filters.push(this.updatedParams.orderBy === 'lastActive' ? 'Recently active' : 'Newest members');

    return filters.length > 0 ? `Selected: ${filters.join('  | ')}` : 'All Members';
  }
}
