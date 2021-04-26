import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { baseURL } from '../shared/baseurl';
import { switchMap } from 'rxjs/operators';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  @ViewChild('cform') commentFormDirective;

  commentForm: FormGroup;
  comment: Comment;
  formErrors = {
    'author': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.',
      'maxlength':     'Comment cannot be more than 250 characters long.'
    },
  };

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL
    ) { }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
      this.createForm();
    }

    createForm(): void {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        rating: [0],
        date: [new Date().toISOString()]
      });

      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  
    this.onValueChanged(); // (re)set validation messages now
    }

    onSubmit() {
      if(this.commentForm){
        this.comment = this.commentForm.value;
        this.dish.comments.push(this.comment);
      }
      this.comment = this.commentForm.value;
      console.log(this.comment);
      this.commentForm.reset({
        author: '',
        comment: '',
        rating: 0,
        date: ''
      });
      this.commentFormDirective.resetForm();
    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty || !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }

  goBack(): void {
    this.location.back();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  formatLabel(value: number) {
    if (value >= 0) {
      return value;
    }

    return value;
  }

}



  


