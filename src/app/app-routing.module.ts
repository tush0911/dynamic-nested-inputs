import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamicInputsComponent} from './dynamic-inputs/dynamic-inputs.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/dynamic-inputs', pathMatch: 'full' },
  { path: 'dynamic-inputs', component: DynamicInputsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
