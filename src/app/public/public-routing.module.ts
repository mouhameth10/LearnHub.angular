import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListLoginComponent } from './login/list-login/list-login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { InscriptionComponent } from './inscription/inscription.component';

const routes: Routes = [
  {path:"",component:AccueilComponent},
{path:"login",component:ListLoginComponent},
{path:"inscription",component:InscriptionComponent},
{path:"accueil",component:AccueilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
