import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEntrepriseComponent } from './entreprise/list-entreprise/list-entreprise.component';
import { ListFormationComponent } from './formation/list-formation/list-formation.component';
import { ListInscriptionComponent } from './inscription/list-inscription/list-inscription.component';
import { ListRoleComponent } from './role/list-role/list-role.component';
import { ListUtilisateurComponent } from './utilisateur/list-utilisateur/list-utilisateur.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path:"",component:ListFormationComponent},
  // {path:"",component:ListEntrepriseComponent},
{path:"entreprise",component:ListEntrepriseComponent},
{path:"formation",component:ListFormationComponent},
{path:"inscription",component:ListInscriptionComponent},
{path:"role",component:ListRoleComponent},
{path:"profile",component:ProfileComponent},
{path:"utilisateur",component:ListUtilisateurComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
