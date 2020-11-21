import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutsService} from '../../services/checkouts.service';
import {Page} from '../../models/page';
import {CheckedBook} from '../../models/checked-book'
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {PageService} from "../../services/page.service";
import {UtilService} from "../../services/util.service";
import {SelectionService} from "../../services/selection.service";
import {SelectionModel} from "@angular/cdk/collections";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'app-checkouts-list',
	templateUrl: './checkouts-table.component.html',
	styleUrls: ['./checkouts-table.component.scss'],
	providers: [SelectionService],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({height: '0px', minHeight: '0'})),
			state('expanded', style({height: '*'})),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class CheckoutsTableComponent implements OnInit {
	displayedColumns: string[] = ['select', 'title', 'dueDate', 'genre', 'author', 'status'];
	checkedBooks: Page<Book>;
	dataSource: MatTableDataSource<Book>;
	dataSource2: MatTableDataSource<CheckedBook<Book>>;
	dataSource3: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;
	selection = new SelectionModel<Book>(true, []);
	expandedBook: MatTableDataSource<Book> | null;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private selectionService: SelectionService, private utilService: UtilService,
		private checkoutsService: CheckoutsService, private  pageService: PageService
	) {
	}

	ngOnInit(): void {
		this.isDisabled = false;
		this.currentPage = 0;
		this.checkoutsService.getCheckouts({pageIndex: this.currentPage, pageSize: 50}).subscribe(
			books => {
				this.checkedBooks = books;
				this.dataSource = new MatTableDataSource(books.content);
				this.dataSource2 = new MatTableDataSource(books.content);
				this.dataSource3 = new MatTableDataSource<Book>();
				this.dataSource2.data.forEach(book => {
					this.dataSource3.data.push(book.borrowedBook)
				})
				console.log(this.dataSource3.data.forEach(data => console.log(data)));
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				//This is written with heavy help from stackoverflow. It allows sorting of nested objects
				this.dataSource.sortingDataAccessor = (data, sortHeaderId: string) => {
					return this.pageService.getPropertyByPath(data.borrowedBook, sortHeaderId);
				};
			},
			err => console.log('HTTP Error', err)
		);
		this.expandedBook = this.dataSource;
	}

	expandedElement(element) {
		console.log(this.dataSource.data[0]);
		let test = this.dataSource.data.findIndex(book =>  book.id === element.id);
		this.checkoutsService.getCheckout(element.id).subscribe(  checkout => {
			this.dataSource.data[test] = checkout;
		});
		this.expandedBook = this.expandedBook === element ? null : element;
	}

	filterInput(event: Event) {
		this.utilService.filterInput(event, this.dataSource)
	}

	onClick() {
		this.pageService.getAllItems(
			this.checkoutsService.getCheckouts({pageSize: this.checkedBooks.totalElements}),
			this.dataSource, this.sort,
			this.paginator
		);
		this.isDisabled = true;
	}

	//Moved this into its own service so there would'nt be repeating code
	handlePage(event: any) {
		this.currentPage++;
		this.pageService.handlePage(
			this.dataSource, event,
			this.checkedBooks,
			this.checkoutsService.getCheckouts({pageIndex: this.currentPage, pageSize: 50}),
			this.paginator
		)
	}

	isAllSelected() {
		return this.selectionService.isAllSelected(this.selection, this.dataSource)
	}

	masterToggle() {
		return this.selectionService.masterToggle(this.selection, this.dataSource);
	}

	removeSelectedRows() {
		return this.selectionService.removeSelectedRows(
			this.selection, this.dataSource,
			this.paginator, this.checkoutsService,
			"Return the book?"
		);
	}
}
