import {Component, OnInit} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Book} from '../../models/book';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';

@Component({
	selector: 'app-create-book',
	templateUrl: './create-book.component.html',
	styleUrls: ['./create-book.component.scss']
})
export class CreateBookComponent implements OnInit {
	book$: Observable<Book | Error>;
	book: Book;
	name: string;

	constructor(
		private route: ActivatedRoute,
		private bookService: BookService,
	) {
	}

	ngOnInit(): void {
		this.book$ = this.route.params
			.pipe(map(params => params.id))
			.pipe(switchMap(id => this.bookService.getBook(id)))
	}

	changed() {
		console.log(this.name);
	}

	emailUpdated(event) {
		console.log("New email", event.target.value);
	}

}
