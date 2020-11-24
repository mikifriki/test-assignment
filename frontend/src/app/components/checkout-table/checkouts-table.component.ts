import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutsService} from '../../services/checkouts.service';
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
	//this animations is from the expansion table angular material example.
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
	dataSource: MatTableDataSource<CheckedBook>;
	isDisabled: boolean;
	currentPage: number;
	selection = new SelectionModel<Book>(true, []);
	expandedBook: Book;
	totalPages: number;

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
				this.dataSource = new MatTableDataSource(books.content);
				this.totalPages = books.totalElements;
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				//This is written with heavy help from stackoverflow. It allows sorting of nested objects
				this.dataSource.sortingDataAccessor = (data, sortHeaderId: string) => {
					return this.pageService.getPropertyByPath(data.borrowedBook, sortHeaderId);
				};

				this.dataSource.filterPredicate = (data: CheckedBook, filter) => {
					const dataStr = JSON.stringify(data).toLowerCase();
					return dataStr.indexOf(filter) != -1;
				}
			},
			err => console.log('HTTP Error', err)
		);

	}

	expandedElement(tableBook) {
		this.checkoutsService.getCheckout(tableBook.id).subscribe(checkout => {
			this.dataSource.data[this.dataSource.data.findIndex(book => book.id === tableBook.id)] = checkout;
		});
		this.expandedBook = this.expandedBook === tableBook ? null : tableBook;
	}

	filterInput(event: Event) {
		this.utilService.filterInput(event, this.dataSource);
	}

	//This button is to get all the books at once.
	//It disables itself once it has been clicked.
	onClick() {
		this.checkoutsService.getCheckouts({pageSize: this.totalPages}).subscribe(
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
	//This sends this tables datasource, total pages there are supposed to be and the get next books.
	//The reason the get books service is called here is because I want to use the general functionality in another table.
	//This was fun to code because I got to use a nicely paginated API.
	//The Datasource gets updated and kept up to date so there wont be any useless calls for the same data again.
	handlePage(event: any) {
		if (this.isDisabled == true) return;
		this.currentPage++;
		this.pageService.handlePage(
			this.dataSource, event,
			this.totalPages,
			this.checkoutsService.getCheckouts({pageIndex: this.currentPage, pageSize: 50}),
			this.paginator
		);

	}

	//This checks if all the current items of the datasource are selected.
	//This again is in a service because I reuse the same functionality in the other table
	isAllSelected() {
		return this.selectionService.isAllSelected(this.selection, this.dataSource)
	}

	//This adds select all and deselect all to the top most checkbox of the item.
	masterToggle() {
		return this.selectionService.masterToggle(this.selection, this.dataSource);
	}

	isBookLate(string: string) {
		return this.utilService.isBookLate(string)
	}

	//This gets all the selected items and opens the dialog to check if you are sure if you want to return the books.
	//There is more documented in the service itself.
	removeSelectedRows() {
		return this.selectionService.returnBook(
			this.selection, this.dataSource,
			this.paginator, this.checkoutsService,
			"Return the book?"
		);
	}
}
