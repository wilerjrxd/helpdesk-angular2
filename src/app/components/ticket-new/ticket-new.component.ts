import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ticket } from 'src/app/model/ticket.model';
import { SharedService } from 'src/app/services/shared.service';
import { TicketService } from 'src/app/services/ticket.service';
import { ResponseApi } from 'src/app/model/response-api';

@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.component.html',
  styleUrls: ['./ticket-new.component.css']
})
export class TicketNewComponent implements OnInit {

  @ViewChild('form')
  form: NgForm;

  ticket = new Ticket('', null, '', '', 0, '', '', null, '', '', null);
  shared: SharedService;
  message: {};
  classCss: {};

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {
    this.shared = SharedService.getInstance();
  }

  ngOnInit() {
    const id: string = this.route.snapshot.params.id; // used to catch the param passed through the URL
    if (id !== undefined) {
      this.findById(id);
    }
  }

  findById(id: string) {
    this.ticketService.findById(id).subscribe((responseApi: ResponseApi) => {
      this.ticket = responseApi.data;
    }, err => {
      this.showMessage({
        type: 'error',
        text: err.error.errors[0] // err[error][errors][0]
      });
    });
  }

  register() {
    this.message = {};
    this.ticketService.createOrUpdate(this.ticket).subscribe((responseApi: ResponseApi) => {
      this.ticket = new Ticket('', null, '', '', 0, '', '', null, '', '', null);
      const ticketRet: Ticket = responseApi.data;
      this.form.resetForm();
      this.showMessage({
        type: 'success',
        text: `Registered ${ticketRet.title} succesfully`
      });
      // this.router.navigate(['/ticket-list']);
    }, err => {
      this.showMessage({
        type: 'error',
        text: err.error.errors[0]
      });
    });
  }

  onFileChange(event): void {
    if (event.target.files[0].size > 2000000) {
      this.showMessage({
        type : 'error',
        text: 'Maximum image size is 2 MB'
      });
    } else {
      this.ticket.image = '';
      const reader = new FileReader();
      reader.onloadend = (e: Event) => {
        this.ticket.image = reader.result.toString();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private showMessage(message: {type: string, text: string}): void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => {
      this.message = undefined;
    }, 3000);
  }

  private buildClasses(type: string): void {
    this.classCss = {
      alert : true
    };
    this.classCss['alert-' + type] = true;
  }

  getFormGroupClass(isInvalid: boolean, isDirty: boolean): {} {
    return {
      'form-group' : true,
      'has-error' : isInvalid && isDirty,
      'has-success' : !isInvalid && isDirty
    };
  }

}
