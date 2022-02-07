import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { timer } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'log-in-register',
  templateUrl: './log-in-register.component.html',
  styleUrls: ['./log-in-register.component.css'],
})
export class LogInRegisterComponent implements OnInit {
  public logIn: boolean = false;
  public userForRegistration: User;
  public registerFg: FormGroup;
  public loginFg: FormGroup;
  public showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerFg = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        userName: ['', [Validators.required]],
        email: ['', [Validators.required]],
        phoneNumber: ['', []],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { updateOn: 'change' }
    );

    this.loginFg = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerFg.get('password').addValidators(this.passwordValidator());
    this.registerFg
      .get('confirmPassword')
      .addValidators(this.confirmPasswordValidator());
  }

  onModeChange() {
    console.log(this.logIn);
  }

  register() {
    console.log(this.onPrepareModel(this.registerFg));
    let user = this.onPrepareModel(this.registerFg);
    user = {...user, roles: ['User']};
    this.authService.signIn(user);
  }
  getControls(control: string) {
    return this.registerFg.get(control) as FormControl;
  }

  getControlsForLogIn(control: string) {
    return this.loginFg.get(control) as FormControl;
  }

  login() {
    console.log(this.onPrepareModel(this.loginFg));
    let user = this.onPrepareModel(this.loginFg);
    this.authService.logIn(user);
  }

  private onPrepareModel(fg: FormGroup) {
    let res = {};
    let controls = fg.controls;
    Object.keys(controls).forEach((prop) => {
      res = { ...res, [prop.toString()]: controls[prop].value };
    });

    return res;
  }

  onShowPassword() {
    this.showPassword = !this.showPassword;
    setTimeout(() => {
      this.showPassword = false;
    }, 1500);
  }

  onConfirmPassword() {
    let password = this.registerFg.get('password') as FormControl;
    let confirmp = this.registerFg.get('confirmPassword') as FormControl;
    if (password.value && confirmp.value) {
      return password.value == confirmp.value;
    }
    return false;
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      const confirmPassword = this.registerFg.get('confirmPassword')
        .value as string;
      // console.log(`${password} | ${confirmPassword}`);
      let equal;
      if (confirmPassword) {
        equal = password == confirmPassword;
      } else {
        equal = true;
      }
      this.registerFg.updateValueAndValidity({
        emitEvent: true,
        onlySelf: false,
      });
      return !equal ? { equal: { value: true } } : null;
    };
  }
  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPassword = control.value;
      const password = this.registerFg.get('password').value as string;
      // console.log(`${password} | ${confirmPassword}`);
      let equal = password == confirmPassword;
      if (equal) {
        this.registerFg.updateValueAndValidity({
          emitEvent: true,
          onlySelf: false,
        });
      }
      return !equal ? { equal: { value: true } } : null;
    };
  }
}
