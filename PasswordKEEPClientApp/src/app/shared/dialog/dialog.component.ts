import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit, OnDestroy {
  public title: string = 'Tittle';
  public message: string = 'Message';
  public confirm: boolean;
  public modalResult: Subject<boolean> = new Subject<boolean>();
  public modalResult$: Observable<boolean>;
  constructor() {
    this.modalResult$ = this.modalResult.asObservable();
  }
  ngOnDestroy(): void {
    this.modalResult.unsubscribe();
  }

  ngOnInit(): void {}

  closeModal() {
    this.confirm = false;
    this.modalResult.next(this.confirm);
  }

  confirmResult() {
    this.confirm = true;
    this.modalResult.next(this.confirm);
  }
}
