import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { DialogService } from './../../services/dialog.service';
import { SharedService } from './../../services/shared.service';
import { Component, OnInit } from '@angular/core';
import { ResponseApi } from 'src/app/model/response-api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  page = 0;
  count = 5;
  pages: Array<number>;
  shared: SharedService;
  message: {};
  classCss: {};
  userList: [];


  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private router: Router
  ) {
    this.shared = SharedService.getInstance();
  }

  ngOnInit() {
    this.findAll(this.page, this.count);
  }

  findAll(page: number, count: number) {
    this.userService.findAll(page, count).subscribe((responseApi: ResponseApi) => {
      this.userList = responseApi.data.content; // userList receives the users returned as a Response from the API
      this.pages = new Array(responseApi.data.totalPages);
    }, err => {
      this.showMessage({
        type: 'error',
        text: err.error.errors[0]
      });
    });
  }

  edit(id: string) {
    this.router.navigate(['/user-new', id]); // TODO: generate a component EditUser to edit the user
  }

  delete(id: string) {
    this.dialogService.confirm('Do you really want to remove this user?')
          .then((canDelete: boolean) => {
            if (canDelete) {
              this.message = {};
              this.userService.delete(id).subscribe((responseApi: ResponseApi) => {
                this.showMessage({
                  type : 'success',
                  text : 'User removed successfully'
                });
                setTimeout(() => {
                  this.userService.findAll(this.page, this.count);
                }, 3000);
              }, err => {
                this.showMessage({
                  type : 'error',
                  text : err.error.errors[0]
                });
              });
            }
          });
  }

  setPreviousPage(event: any) {
    event.preventDefault();
    if (this.page > 0) {
      this.page = this.page - 1;
      this.findAll(this.page, this.count);
    }
  }

  setPage(i: number, event: any) {
    event.preventDefault();
    this.page = i;
    this.findAll(this.page, this.count);
  }

  setNextPage(event: any) {
    event.preventDefault();
    if (this.page + 1 < this.pages.length) {
      this.page = this.page + 1;
      this.findAll(this.page, this.count);
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

}
