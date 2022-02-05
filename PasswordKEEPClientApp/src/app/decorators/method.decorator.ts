import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { timer } from 'rxjs';
import { ServiceInjector } from '../app.module';
import { DialogComponent } from '../shared/dialog/dialog.component';

export function Confirmable(title: string, message: string) {
  return function (
    targer: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    let modalService: NgbModal;
    const original = descriptor.value;
    const delay = timer(1000);
    delay.subscribe(() => {
      modalService = ServiceInjector.get(NgbModal);
    });
    descriptor.value = function (...args: any[]) {
      let modalRef = modalService.open(DialogComponent, {
        backdrop: 'static',
        centered: true,
      });
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.modalResult$.subscribe((res) => {
        if (res) {
          const result = original.apply(this, args);
          modalRef.close();
          return result;
        } else {
          modalRef.close();
          return null;
        }
      });
    };
  };
}
