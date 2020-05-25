import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../shared/custom.validators';

@Component({
  selector: 'app-dynamic-inputs',
  templateUrl: './dynamic-inputs.component.html',
  styleUrls: ['./dynamic-inputs.component.css']
})
export class DynamicInputsComponent implements OnInit {

  validationMessages = {
    fullName: {
      required: 'Full name is required!',
      minlength: 'Full name must be greater than 2 characters!',
      maxlength: 'Full name must be less than 10 characters!'
    },
    email: {
      required: 'Email is required!',
      emailDomain: 'Email domain should be like abc@dell.com'
    },
    confirmEmail: {
      required: 'Email must match!'
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm email do not matched!'
    },
    phone: {
      required: 'Phone is required!'
    }
  };

  formErrors = {
    fullName: '',
    email: '',
    confirmEmail: '',
    emailGroup: '',
    phone: '',
    skillName: '',
    experienceInYears: '',
    proficiency: ''
  };

  constructor(private fb: FormBuilder) {
  }

  studentForm: FormGroup;


  ngOnInit() {
    this.studentForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('dell.com')]],
        confirmEmail: ['', Validators.required],
      }, {validators: matchEmail}),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.studentForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    this.studentForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.studentForm);
    });
  }

  addSkillButtonClick(): void {
    (this.studentForm.get('skills') as FormArray).push(this.addSkillFormGroup());
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.studentForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
  }

  onSubmit(): void {
    console.log(this.studentForm.value);
  }

  onLoadDataClick(): void {
    const formArray1 = this.fb.array([
      new FormControl('Tushar', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('', Validators.required),
    ]);

    // for (const control of formArray.controls) {
    //   if (control instanceof FormControl) {
    //     console.log('Control of FormControl');
    //   }
    //   if (control instanceof FormGroup) {
    //     console.log('Control of FormGroup');
    //   }
    //   if (control instanceof FormArray) {
    //     console.log('Control of FormArray');
    //   }
    // }
  }


  logValidationErrors(group: FormGroup = this.studentForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

}

function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (emailControl.value === confirmEmailControl.value) {
    return null;
  } else {
    return { emailMismatched: true };

  }
}
