import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true, // Composant autonome
  imports: [RouterModule,NgbDropdownModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  menu:any={
    titre:"Menu",
    items:[
      {libelle:"Entreprise",path:"/home/entreprise"},
{libelle:"Formation",path:"/home/formation"},
{libelle:"Inscription",path:"/home/inscription"},
{libelle:"Role",path:"/home/role"},
{libelle:"Utilisateur",path:"/home/utilisateur"}
    ]
  }
}
