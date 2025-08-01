import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe,FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {

  @ViewChild('editForm') editForm?:NgForm;
  @HostListener('window:beforeunload',['$event']) notify($event:BeforeUnloadEvent){
    if(this.editForm?.dirty){
      $event.preventDefault();
    }
  }

  private accountSerice=inject(AccountService);
  private toast=inject(ToastService);
  protected memberService=inject(MemberService);
  protected editableMember:EditableMember={
    displayName:'',
    description:'',
    city:'',
    country:''
  }



  ngOnInit(): void {
     this.editableMember={
    displayName:this.memberService.member()?.displayName || '',
    description:this.memberService.member()?.description || '',
    country: this.memberService.member()?.country|| '',
    city:this.memberService.member()?.city || ''
   }
  }

  updateProfile(){
    if(!this.memberService.member()) return;
   const updatedMember={...this.memberService.member(), ...this.editableMember}
   this.memberService.updateMember(updatedMember).subscribe({
    next:()=>{
      const currentUser=this.accountSerice.currectUser();
      if(currentUser && currentUser?.displayName!==updatedMember.displayName)
      {
       currentUser.displayName=updatedMember.displayName;
       this.accountSerice.setCurrentUser(currentUser);
      }
   this.toast.success('Profile updated successfully');
   this.memberService.editMode.set(false);
   this.memberService.member.set(updatedMember as Member);
   this.editForm?.reset(updatedMember);
    }
   })

  }

    ngOnDestroy(): void {
   if(this.memberService.editMode())
   {
    this.memberService.editMode.set(false);
   }
  }


}
