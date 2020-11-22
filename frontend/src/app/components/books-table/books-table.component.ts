import {Component, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../models/page';
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {BookService} from '../../services/book.service';
import {CheckoutsService} from "../../services/checkouts.service";
import {PageService} from "../../services/page.service";
import {UtilService} from "../../services/util.service";
import {SelectionService} from "../../services/selection.service";
import {animate, state, style, transition, trigger} from "@angular/animations";


@Component({
	selector: 'app-books-list',
	templateUrl: './books-table.component.html',
	styleUrls: ['./books-table.component.scss'],
	providers: [SelectionService],
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
	currentBooks: Page<Book>;
	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;
	selection = new SelectionModel<Book>(true, []);
	expandedBook: Book;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;


	constructor(public utilService: UtilService,
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
				this.currentBooks = books;
				this.dataSource = new MatTableDataSource(books.content);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			err => console.log('HTTP Error', err)
		);
	}

	filterInput(event: Event) {
		this.utilService.filterInput(event, this.dataSource)
	}

	onClick() {
		this.bookService.getBooks({pageSize: this.currentBooks.totalElements}).subscribe(
			books => {
				this.dataSource = new MatTableDataSource(books.content);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			err => console.log('HTTP Error', err)
		);
		this.isDisabled = true;
	}

	//Moved this into its own service so there would'nt be repeating code
	handlePage(event: any) {
		if (this.isDisabled == true) return;
		this.currentPage++;
		this.pageService.handlePage(
			this.dataSource, event,
			this.currentBooks,
			this.bookService.getBooks({pageIndex: this.currentPage, pageSize: 50}),
			this.paginator
		);
	}

	expandedElement(tableBook) {
		this.bookService.getBooks(tableBook.id).subscribe(checkout => {
			checkout.content.forEach(books => {
				if (books.id == this.dataSource.data[this.dataSource.data.findIndex(book => book.id === tableBook.id)].id) {
					this.dataSource.data[this.dataSource.data.findIndex(book => book.id === tableBook.id)] = books
				}
			});
		});
		this.expandedBook = this.expandedBook === tableBook ? null : tableBook;
	}


	Checkout() {
		this.selectionService.checkout(this.selection);
	}

	isAllSelected() {
		return this.selectionService.isAllSelected(this.selection, this.dataSource)
	}

	masterToggle() {
		return this.selectionService.masterToggle(this.selection, this.dataSource);
	}

	removeSelectedRows() {
		return this.selectionService.removeSelectedRows(this.selection, this.dataSource, this.paginator, this.bookService);
	}

	addToFavorites() {
		return this.selectionService.addToFavorites(this.selection);
	}
}
