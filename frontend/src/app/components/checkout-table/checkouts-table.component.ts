import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutsService} from '../../services/checkouts.service';
import {Observable} from 'rxjs';
import {Page} from '../../models/page';
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {PageService} from "../../services/page.service";

@Component({
	selector: 'app-checkouts-list',
	templateUrl: './checkouts-table.component.html',
	styleUrls: ['./checkouts-table.component.scss']
})

export class CheckoutsTableComponent implements OnInit {
	books$: Observable<Page<Book>>;
	displayedColumns: string[] = ['title', 'genre', 'dueDate', 'author', 'status'];
	checkedBooks: Page<Book>;
	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private checkoutsService: CheckoutsService, private  pageService: PageService) {
	}

	ngOnInit(): void {
		this.isDisabled = false;
		this.currentPage = 0;
		this.books$ = this.checkoutsService.getCheckouts({pageIndex: this.currentPage, pageSize: 50});
		this.checkoutsService.getCheckouts({pageIndex: this.currentPage, pageSize: 50}).subscribe(
			books => {
				this.checkedBooks = books;
				console.log(books.content);
				this.dataSource = new MatTableDataSource(books.content);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			err => console.log('HTTP Error', err)
		);
	}

	filterInput(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	onClick() {
		this.checkoutsService.getCheckouts({pageSize: this.checkedBooks.totalElements}).subscribe(
			countries => {
				this.dataSource = new MatTableDataSource(countries.content);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				this.isDisabled = true;
			},
			err => console.log('HTTP Error', err)
		);


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
}
