import {Component, OnInit, ViewChild} from '@angular/core';
import {Book} from '../../models/book';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {BookService} from '../../services/book.service';
import {CheckoutsService} from '../../services/checkouts.service';
import {PageService} from '../../services/page.service';
import {UtilService} from '../../services/util.service';
import {SelectionService} from '../../services/selection.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
	selector: 'app-books-list',
	templateUrl: './books-table.component.html',
	styleUrls: ['./books-table.component.scss'],
	providers: [SelectionService],
	// this animations is from the expansion table angular material example.
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({height: '0px', minHeight: '0'})),
			state('expanded', style({height: '*'})),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class BooksTableComponent implements OnInit {
	displayedColumns: string[] = ['select', 'title', 'author', 'genre', 'status', 'year'];
	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;
	selection = new SelectionModel<Book>(true, []);
	expandedBook: Book;
	totalPages: number;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		public utilService: UtilService,
		private pageService: PageService,
		private checkoutsService: CheckoutsService,
		private bookService: BookService,
		private selectionService: SelectionService
	) {
	}

	ngOnInit(): void {
		this.isDisabled = false;
		this.currentPage = 0;
		this.bookService.getBooks({pageIndex: this.currentPage, pageSize: 50}).subscribe(
			books => {
				this.totalPages = books.totalElements;
				this.dataSource = new MatTableDataSource(books.content);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			err => console.log('HTTP Error', err)
		);
	}

	// Sends input to utility service to get filtered datasource
	filterInput(event: Event) {
		this.utilService.filterInput(event, this.dataSource);
	}

	// This button is to get all the books at once.
	// It disables itself once it has been clicked.
	onClick() {
		this.bookService.getBooks({pageSize: this.totalPages}).subscribe(
			books => {
				this.dataSource = new MatTableDataSource(books.content);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			err => console.log('HTTP Error', err)
		);
		this.isDisabled = true;
	}

	// Moved this into its own service so there would'nt be repeating code
	// This sends this tables datasource, total pages there are supposed to be and the get next books.
	// The reason the get books service is called here is because I want to use the general functionality in another table.
	// This was fun to code because I got to use a nicely paginated API.
	// The Datasource gets updated and kept up to date so there wont be any useless calls for the same data again.
	handlePage(event: any) {
		if (this.isDisabled === true) {
			return;
		}
		this.currentPage++;
		this.pageService.handlePage(
			this.dataSource, event,
			this.totalPages,
			this.bookService.getBooks({pageIndex: this.currentPage, pageSize: 50}),
			this.paginator
		);
	}

	// This gets the book id once the element is clicked. Once it is ran the clicked element gets updated.
	// The update is because if the book has been changed in the api it will get the newest data.
	// This was pretty easy to create and it is my solution to the individual book view.
	expandedElement(tableBook) {
		this.bookService.getBook(tableBook.id).subscribe(book => {
			this.dataSource.data[this.dataSource.data.findIndex(books => books.id === tableBook.id)] = book;
		});
		this.expandedBook = this.expandedBook === tableBook ? null : tableBook;
	}


	// This calls the checkout function in selectionService. It gets all the selected books in the checkout table.
	// Then it changes the checkout status of the book to borrowed and and does an API call to send the checked out book into an api.
	// In order for it to be successful the checkout REQUIRES the users name and family name.
	Checkout() {
		this.selectionService.checkout(this.selection);
	}

	// This checks if all the current items of the datasource are selected.
	// This again is in a service because I reuse the same functionality in the other table
	isAllSelected() {
		return this.selectionService.isAllSelected(this.selection, this.dataSource);
	}

	// This adds select all and deselect all to the top most checkbox of the item.
	masterToggle() {
		return this.selectionService.masterToggle(this.selection, this.dataSource);
	}

	// This gets all the selected rows and sends a delete request to the api.
	// Only BORROWED books can be deleted.
	removeSelectedRows() {
		return this.selectionService.removeSelectedRows(this.selection, this.dataSource, this.paginator, this.bookService);
	}

	// This gets all the selected items and sends them to be added to the localstorage.
	// More info on how the info is sent, added and how the favorites display is updated is in the favorites service.
	addToFavorites() {
		return this.selectionService.addToFavorites(this.selection);
	}

	isBookLate(id: string) {
		return this.utilService.isBookLate(id);
	}
}
