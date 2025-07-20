import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddFormationComponent } from '../add-formation/add-formation.component';
import { EditFormationComponent } from '../edit-formation/edit-formation.component';
import { DetailsFormationComponent } from '../details-formation/details-formation.component';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormationTafType } from '../taf-type/formation-taf-type';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-formation',
  standalone: true,
  imports: [FormsModule, NgSelectModule, NgbModalModule],
  templateUrl: './list-formation.component.html',
  styleUrls: ['./list-formation.component.css']
})
export class ListFormationComponent implements OnInit, OnDestroy {
  loading_get_formation = false;
  loading_delete_formation = false;
  les_formations: FormationTafType[] = [];
  list: FormationTafType[] = [];
  animateursList: any[] = [];
  filter: any = {
    text: [],
  };
  currentUser: any;

  constructor(public api: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    console.groupCollapsed("ListFormationComponent");
    this.currentUser = this.api.token.user_connected;
    this.get_formation();
     this.api.taf_post("utilisateur/get", {}, (reponse: any) => {
    if (reponse.status) {
      this.animateursList = (reponse.data || []).filter((u: any) => u.id_role === 3);
    }
  },(error: any) => {
      this.loading_get_formation = false;
    });
  }

  ngOnDestroy(): void {
    console.groupEnd();
  }

  get_formation() {
    this.loading_get_formation = true;
    this.api.taf_post("formation/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_formations = reponse.data;
        console.log("Opération effectuée avec succès sur la table formation. Réponse= ", reponse);
        this.filter_change();
      } else {
        console.log("L'opération sur la table formation a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_get_formation = false;
    }, (error: any) => {
      this.loading_get_formation = false;
    });
  }

  filter_change(event?: any) {
    this.list = this.les_formations.filter((one: any) => {
      let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/\s/g, '')
        .includes(event?.term?.toLowerCase().replace(/\s/g, ''));
      return search;
    });
  }

  async delete_formation(formation: FormationTafType) {
    // Afficher la boîte de dialogue de confirmation
    const result = await Swal.fire({
      title: `Confirmer la suppression de "${formation.intitule}" ?`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      icon: 'question'
    });

    if (!result.isConfirmed) {
      return; // Annuler si l'utilisateur clique sur "Annuler"
    }

    this.loading_delete_formation = true;
    this.api.taf_post("formation/delete", formation, (reponse: any) => {
      if (reponse.status) {
        console.log("Opération effectuée avec succès sur la table formation. Réponse= ", reponse);
        this.get_formation();
        this.api.Swal_success("Formation supprimée avec succès");
      } else {
        console.log("L'opération sur la table formation a échoué. Réponse= ", reponse);
        this.api.Swal_error("La suppression a échoué");
      }
      this.loading_delete_formation = false;
    }, (error: any) => {
      console.log("Erreur inconnue! ", error);
      this.api.Swal_error("Erreur inconnue");
      this.loading_delete_formation = false;
    });
  }

  openModal_add_formation() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"
    };
    const modalRef = this.modalService.open(AddFormationComponent, { ...options, backdrop: 'static' });
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_formation();
      }
    });
  }

  openModal_edit_formation(one_formation: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"
    };
    const modalRef = this.modalService.open(EditFormationComponent, { ...options, backdrop: 'static' });
    modalRef.componentInstance.formation_to_edit = one_formation;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_formation();
      }
    });
  }

openModal_details_formation(formation: FormationTafType) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"
    };
    const modalRef = this.modalService.open(DetailsFormationComponent, { ...options, backdrop: 'static' });
    modalRef.componentInstance.formation = formation;
    // Passe la liste globale des animateurs
    modalRef.componentInstance.animateursList = this.animateursList || [];
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_formation();
      }
    });
}
}
