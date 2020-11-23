import {Injectable} from '@angular/core';
import {BookService} from "./book.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Injectable({
	providedIn: 'root'
})
export class PageService {

	constructor(private bookService: BookService) {
	}

	//Got this idea from looking at Angular documentation, and finding that mat-paginator has event emitters.
	//This gets the event, datasource, total pages the service and paginator and gets the next 50 items from the paginated api
	//This keeps the previous datasource but just adds the next 50 onto it.
	//This was also interesting to create because I had to make it as generic as possible so i could use the same functionality
	//in both tables without copy/pasting code.
	handlePage(dataSource: MatTableDataSource<any>, event: any, totalPages: number, service, paginator: MatPaginator) {
		if (dataSource.data.length == totalPages) return;
		if (event.previousPageIndex < event.pageIndex || event.pageSize === event.length) {
			service.subscribe(
				countries => {
					dataSource.data.push(...countries.content);
					dataSource.paginator = paginator;
				},
				err => console.log('HTTP Error', err)
			);
		} return;
	}

	//This gets the selected books and makes a delete request to the api.
	//This also removes the element from the datasource so there is an immediate feedback
	//Only BORROWED books can be deleted.
	removeSelected(selected, dataSource, service, paginator) {
		selected.forEach(book => {
			if (book.status !== "AVAILABLE" && service == this.bookService) return;
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

	//This gets the property by path as the name states.
	//I removed this here because it was and easy thing to create as an function.
	getPropertyByPath(obj: Object, pathString: string) {
		return pathString.split('.').reduce((o, i) => o[i], obj);
	}
}
