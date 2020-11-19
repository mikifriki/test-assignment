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

	constructor() {
	}

	ngOnInit(): void {
	}
}
