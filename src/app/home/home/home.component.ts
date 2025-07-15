import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../service/api/api.service';
import { DeconnexionComponent } from '../../public/deconnexion/deconnexion.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgbDropdownModule,DeconnexionComponent,FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Menu structure
  private fullMenu = {
    titre: "Menu",
    items: [
      { libelle: "Entreprise", path: "/home/entreprise" },
      { libelle: "Formation", path: "/home/formation" },
      { libelle: "Inscription", path: "/home/inscription" },
      { libelle: "Role", path: "/home/role" },
      { libelle: "Utilisateur", path: "/home/utilisateur" }
    ]
  };

  // Filtered menu based on user role
  menu: any;

  constructor(private api: ApiService,private modalService: NgbModal) {
    // Get the user's role from the API service
    const id_role = this.api.token.user_connected.id_role;

    // Filter menu items based on id_role
    this.menu = {
      ...this.fullMenu,
      items: this.filterMenuItems(this.fullMenu.items, id_role)
    };
  }

  private filterMenuItems(items: any[], id_role: number): any[] {
    if (id_role === 2) {
      // Exclude "Entreprise" and "Utilisateur" for id_role 2
      return items.filter(item => item.libelle !== "Entreprise" && item.libelle !== "Utilisateur"&& item.libelle !== "Role");
    }
    return items; // Return full menu for other roles
  }
  openModal_deconnexion() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: 'sm'
    };
    const modalRef = this.modalService.open(DeconnexionComponent, { ...options, backdrop: 'static' });
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        // Handle successful logout if needed
      }
    });
  }
}
