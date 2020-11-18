import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutsService} from '../../services/checkouts.service';
import {Observable} from 'rxjs';
import {Page} from '../../models/page';
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";


@Component({
	selector: 'parent-table-container',
	templateUrl: './parent-table-container.html',
	styleUrls: ['./parent-table-container.scss']
})

export class ParentTableContainer implements OnInit {
	books$: Observable<Page<Book>>;
	currentBooks: Page<Book>;
	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	log(val) {
		console.log(val);
	}

	constructor(private checkoutsService: CheckoutsService) {
	}

	ngOnInit(): void {

	}

}
