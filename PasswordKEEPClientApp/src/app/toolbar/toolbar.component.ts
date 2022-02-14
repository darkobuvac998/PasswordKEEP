import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay, of, timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { FormMode } from '../shared/form-mode';
import { UserFormComponent } from '../user-form/user-form.component';

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
  @Output() mngUsers: EventEmitter<any> = new EventEmitter<any>();
  @Input() canEdit: boolean;
  @Input() canAdd: boolean;
  @Input() canDetail: boolean;
  @Input() canDelete: boolean;
  @Input() canSave: boolean;

  @Input() public goBackBtn: boolean = false;
  public showManageUsers: boolean = false;

  public searchTerm: string = null;
  public isSearchCollapsed: boolean = true;

  public formMode = FormMode;

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.mode = FormMode.Thumbnail;
    let roles =  this.authService.roles.pop().includes('Admin');
    let userComponent = this.route.snapshot.routeConfig.component.name == 'UserFormComponent'
    this.showManageUsers = roles && userComponent;
    this.canAdd = !userComponent;
  }

  onModeChange(newMode: FormMode) {
    if (newMode == FormMode.Detail && this.canDetail) {
      this.modeChange.emit(newMode);
    } else if (newMode == FormMode.Edit && this.canEdit) {
      this.modeChange.emit(newMode);
    } else if (newMode == FormMode.Add && this.canAdd) {
      this.modeChange.emit(newMode);
    } else if (newMode == FormMode.Thumbnail) {
      this.modeChange.emit(newMode);
    }
  }

  onReload() {
    this.reload.emit();
  }

  onSave() {
    if (this.canSave) {
      this.save.emit();
    }
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
    if (this.canDelete) {
      this.delete.emit();
    }
  }

  manageUsers(){
    this.mngUsers.emit();
  }
}
