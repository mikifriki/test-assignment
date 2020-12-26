import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page, PageRequest} from '../models/page';
import {Book} from '../models/book';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {RestUtil} from './rest-util';
import {CheckedBook} from '../models/checked-book';

@Injectable({
	providedIn: 'root'
})
export class CheckoutsService {
	private readonly baseUrl = environment.backendUrl + '/api/checkout';

	constructor(private http: HttpClient) {
	}

	getCheckouts(filter: Partial<PageRequest>): Observable<Page<Book>> {
		const url = this.baseUrl + '/getCheckouts';
		const params = RestUtil.buildParamsFromPageRequest(filter);
		return this.http.get<Page<Book>>(url, {params});
	}

	getCheckout(checkoutId: string): Observable<Book> {
		const url = this.baseUrl + '/getCheckout';
		const params = new HttpParams().set('checkOutId', checkoutId);
		return this.http.get<Book>(url, {params});
	}

	// Done
	checkout(book: CheckedBook): Observable<void | Error> {
		const url = this.baseUrl + '/checkout';
		return this.http.post<void>(url, book);
	}

	// Done
	deleteBook(checkOutId: string): Observable<void | Error> {
		const url = this.baseUrl + '/checkout';
		const params = new HttpParams().set('checkOutId', checkOutId);
		return this.http.delete<void>(url, {params});
	}

}
