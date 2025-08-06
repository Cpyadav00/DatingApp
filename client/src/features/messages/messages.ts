import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../core/services/message-service';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { Paginator } from "../../shared/paginator/paginator";
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-messages',
  imports: [Paginator,DatePipe,RouterLink],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {

private messageService=inject(MessageService);
protected container='Inbox';
protected fetchedContainer='Inbox';
protected pageNumber=1;
protected pageSize=10;
protected paginatedMessages=signal<PaginatedResult<Message> | null>(null);

tabs=[
  {label:'Inbox', value:'Inbox'},
   {label:'Outbox', value:'Outbox'}
]

ngOnInit(): void {
  this.loadMessages();
}

loadMessages(){
  this.messageService.getMessage(this.container,this.pageNumber,this.pageSize).subscribe({
    next:response=>{
      this.paginatedMessages.set(response)
      this.fetchedContainer=this.container;
    }
  })
}

deleteMessage(event:Event,id:string)
{
 event.stopPropagation();
 this.messageService.deleteMessage(id).subscribe({
  next:()=>{
    const current=this.paginatedMessages();
    if(current?.items){
      this.paginatedMessages.update(prev=>{
        if(!prev) return null;

        const newItems=prev.items.filter(x=>x.id !==id) ||[];
        return {
          items:newItems,
          //it will change when the data is delete we are keeping same for the simplity puropse 
          // we have to calucate all the totalpage currentpage totalcount and so on
          metaData:prev.metaData
        }

      })
    }
  }
 })


}

get isInbox(){
  return this.fetchedContainer==='Inbox';
}
setContainer(container:string)
{
 this.container=container;
 this.pageNumber=1;
 this.loadMessages();
}

  onPageChange(event:{pageNumber:number,pageSize:number})
  {
    this.pageSize=event.pageSize;
    this.pageNumber=event.pageNumber;
    this.loadMessages();
  }



}
