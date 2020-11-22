import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ParentTableContainer} from "./components/table-container/parent-table-container";

const routes: Routes = [
	{path: '', redirectTo: 'books', pathMatch: 'full'},
	{path: 'books', component: ParentTableContainer}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
