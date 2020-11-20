import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BookDetailComponent} from './components/book-detail/book-detail.component';
import {ParentTableContainer} from "./components/table-container/parent-table-container";

const routes: Routes = [
	{path: '', redirectTo: 'books', pathMatch: 'full'},
	{path: 'books', component: ParentTableContainer},
	{path: 'books/:id', component: BookDetailComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
