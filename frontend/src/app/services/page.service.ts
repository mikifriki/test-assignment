import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page, PageRequest} from '../models/page';
import {Book} from '../models/book';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {RestUtil} from './rest-util';
import {MatTableDataSource} from "@angular/material/table";

@Injectable({
	providedIn: 'root'
})
export class PageService {
	//Got this idea from looking at Angular documentation, and finding that mat-paginator has event emitters.
	handlePage(dataSource, event: any, currentBooks, page, service, paginator) {
		if (dataSource.data.length == currentBooks.totalElements) return;
		if (event.previousPageIndex < event.pageIndex || event.pageSize === event.length) {
			page++;
			service.subscribe(
				countries => {
					dataSource.data.push(...countries.content);
					dataSource.paginator = paginator;
				},
				err => console.log('HTTP Error', err)
			);
		} else {
			return;
		}
	}

	removeSelected(selected, dataSource, service, paginator) {
		selected.forEach(book => {
			let elementPos = dataSource.data.map((x) => {
				return x.id;
			}).indexOf(book.id);
			service.deleteBook(book.id).subscribe(data => {
					dataSource.data.splice(elementPos, 1);
					dataSource.paginator = paginator
				},
				error => error);
		});
	}

}
