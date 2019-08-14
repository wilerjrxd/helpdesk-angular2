import { HELP_DESK_API } from './helpdesk.api';
import { Ticket } from './../model/ticket.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }

  createOrUpdate(ticket: Ticket) {
    if (ticket.title != null && ticket.title !== '') {
      return this.http.put(`${HELP_DESK_API}/api/ticket`, ticket);
    } else {
      ticket.id = null;
      ticket.status = 'New';
      return this.http.post(`${HELP_DESK_API}/api/ticket`, ticket);
    }
  }

  findById(id: string) {
    return this.http.get(`${HELP_DESK_API}/api/ticket/${id}`);
  }

  findAll(page: number, count: number) {
    return this.http.get(`${HELP_DESK_API}/api/ticket/${page}/${count}`);
  }

  findByParams(page: number, count: number, assignedToMe: boolean, ticket: Ticket) {
    ticket.number = ticket.number === null ? 0 : ticket.number;
    ticket.title = ticket.title === 'uninformed' ? '' : ticket.title;
    ticket.status = ticket.status === 'status' ? '' : ticket.status;
    ticket.priority = ticket.priority === 'uninformed' ? '' : ticket.priority;
    return this.http.get(`${HELP_DESK_API}/api/ticket/${page}/${count}/${ticket.number}
                    /${ticket.title}/${ticket.status}/${ticket.priority}/${assignedToMe}`);
  }

  delete(id: string) {
    return this.http.delete(`${HELP_DESK_API}/api/ticket/${id}`);
  }

  changeStatus(status: string, ticket: Ticket) {
    return this.http.put(`${HELP_DESK_API}/api/ticket/${ticket.id}/${status}`, ticket);
  }

  summary() {
    return this.http.get(`${HELP_DESK_API}/api/ticket/summary`);
  }

}
