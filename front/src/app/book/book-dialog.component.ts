import { Component, OnInit, OnChanges } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  AbstractControl,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng4-validators';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { BookModel } from '../models/book-model';
import { BookService } from '../services/book.service';

const UNPROCESSABLE_ENTITY = 422;

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.css']
})
export class BookDialogComponent implements OnInit {
  bookId: any;
  submitted: boolean;
  form: FormGroup;
  book;

  private readonly errorMessages = {
    required: () => 'This field is required',
    min: params => 'The minimum number is ' + params.requiredValue,
    rangelength: params =>
      'The allowed range of characters is ' + params.requiredValue.join(' - '),
    range: params => 'The allowed range is ' + params.requiredValue.join(' - '),
    backend: params => 'Backend: ' + params.message
  };

  constructor(
    private service: BookService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.bookId = this.route.snapshot.params['id'];
    const [last] = this.route.snapshot.url.slice(-1);
    switch (last.path) {
      case 'delete':
        this.deleteBook();
        break;
      case 'add':
        this.createForm();
        break;
      default:
        this.createForm();
        this.service.getBook(this.bookId).subscribe(
          data => {
            this.book = data.data;
            this.form.reset(this.book);
          },
          error => this.error('Book is not found')
        );
    }
  }

  deleteBook() {
    this.service.deleteBook(this.bookId).subscribe(book => {
      this.success('Book is deleted', '../..');
    });
  }

  createForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, CustomValidators.rangeLength([2, 64])]],
      author: ['', [Validators.required]],
      isbn: ['', [Validators.required]],
      year: [
        '',
        [
          Validators.required,
          CustomValidators.min(1950),
          CustomValidators.range([1900, 2018])
        ]
      ]
    });
  }

  onSubmit() {
    let book$;
    this.submitted = true;
    const book = this.form.value;
    if (this.book) {
      book.id = this.book.id;
      book$ = this.service.updateBook(book);
    } else {
      book$ = this.service.addBook(book);
    }
    book$.subscribe({
      next: data => {
        this.success(`Book is ${book.id ? 'updated' : 'created'}`);
      },
      error: res => {
        if (res.status === UNPROCESSABLE_ENTITY) {
          this.handleSubmitError(res.error.error);
        } else {
          this.toastr.error(res.message, res.statusText || 'Unknown Error');
        }
      }
    });
  }

  success(title, redirectTo = '..') {
    this.toastr.success(title, 'Success!');
    this.router.navigate([redirectTo], { relativeTo: this.route });
  }

  error(title, redirectTo = '..') {
    this.toastr.error(title, 'Error!');
    if (redirectTo) {
      this.router.navigate([redirectTo], { relativeTo: this.route });
    }
  }

  lastError(name: string) {
    const errors = this.fieldErrors(name);
    return Array.isArray(errors) ? errors.pop() : undefined;
  }

  fieldErrors(name: string): string[] {
    const control = this.form.get(name);
    if (control && (control.touched || this.submitted) && control.errors) {
      return this.getErrors(control);
    } else {
      return undefined;
    }
  }

  private getMessage(type: string, params: any) {
    return this.errorMessages[type](params);
  }

  protected getErrors(control: AbstractControl): string[] {
    return Object.keys(control.errors)
      .filter(error => control.errors[error] && this.errorMessages[error])
      .map(error => this.getMessage(error, control.errors));
  }

  protected handleSubmitError(error: any) {
    if (Array.isArray(error.details)) {
      error.details.forEach((data, i) => {
        const control = this.form.get(data.param);
        control.setErrors({ backend: true, message: data.message });
      });
    }
  }
}
