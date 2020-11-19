import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class FavoritesService {
	private updateStorage = new Subject<string>();
	updateStorageObs = <Observable<string>>this.updateStorage;

	addStorage(string) {
		// @ts-ignore
		localStorage.setItem(JSON.stringify(`${string.title}, ${string.author}`), JSON.stringify(string.id));
	}

	sendUpdate(string) {
		this.updateStorage.next(string);
	}

	allStorage() {
		let values = [];
		for (let i = 0; i < localStorage.length; i++) {
			values.push(
				localStorage.key(i).replace(/['"]+/g, '').split(',')
			)
		}
		return values;
	}

	removeItem(string) {
		let keys = Object.keys(localStorage);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key.includes(string)) {
				localStorage.removeItem(key);
			}
		}
	}
}
