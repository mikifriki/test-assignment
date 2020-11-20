import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutsService} from '../../services/checkouts.service';
import {Page} from '../../models/page';
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {PageService} from "../../services/page.service";
import {UtilService} from "../../services/util.service";
import {SelectionService} from "../../services/selection.service";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
	selector: 'app-checkouts-list',
	templateUrl: './checkouts-table.component.html',
	styleUrls: ['./checkouts-table.component.scss'],
	providers: [SelectionService]
})

export class CheckoutsTableComponent implements OnInit {
	displayedColumns: string[] = ['select', 'title', 'dueDate', 'genre', 'author', 'status'];
	checkedBooks: Page<Book>;
	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;
	selection = new SelectionModel<Book>(true, []);

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
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				//This is written with heavy help from stackoverflow. It allows sorting of nested objects
				this.dataSource.sortingDataAccessor = (data, sortHeaderId: string) => {
					return this.pageService.getPropertyByPath(data.borrowedBook, sortHeaderId);
				};
			},
			err => console.log('HTTP Error', err)
		);
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
		this.pageService.handlePage(
			this.dataSource, event,
			this.checkedBooks, this.currentPage,
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
