import {Component} from '@angular/core';
import {Book} from "../book.model";
import {BookService} from "../book.service";
import {catchError, of, tap} from "rxjs";
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.css']
})
export class AddBookFormComponent {

  book: Book = {
    title: '',
    author: '',
    genre: '',
    publicationDate: new Date(),
    isbn: ''
  };

  constructor(private bookService: BookService, private router: Router) {
  }

  onSubmit(bookForm: any): void {
    if (bookForm.valid) {
      this.bookService.addBook(this.book).pipe(
        tap(response => {
          console.log('Book submitted:', response);
          this.book = {title: '', author: '', genre: '', publicationDate: new Date(), isbn: ''};
          this.router.navigate(['/books']);
        }),
        catchError(error => {
          console.error('Error submitting book:', error);
          return of(null);
        })
      ).subscribe();
    }
  }
}
