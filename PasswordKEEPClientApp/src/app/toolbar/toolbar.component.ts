import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { delay, of, timer } from 'rxjs';
import { FormMode } from '../shared/form-mode';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Input() mode: FormMode;
  @Output() modeChange: EventEmitter<FormMode> = new EventEmitter<FormMode>();
  @Output() reload: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  @Input() public goBackBtn: boolean = false;

  public searchTerm: string = null;
  public isSearchCollapsed: boolean = true;

  public formMode = FormMode;

  constructor() {}

  ngOnInit(): void {
    this.mode = FormMode.Thumbnail;
  }

  canAdd() {
    return true;
  }

  onModeChange(mode: FormMode) {
    this.modeChange.emit(mode);
  }

  onReload() {
    this.reload.emit();
  }

  onSave() {
    this.save.emit();
  }

  onGoToAppsMenu() {
    this.goBack.emit();
  }

  onSearch() {
    this.search.emit(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = null;
    this.search.emit(null);
  }

  onSearchTermChange() {
    if (this.searchTerm == '') {
      this.searchTerm = null;
    }
  }

  onDelete() {
    this.delete.emit();
  }
}
