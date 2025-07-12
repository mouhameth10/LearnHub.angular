import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddInscriptionComponent } from '../add-inscription/add-inscription.component';
import { EditInscriptionComponent } from '../edit-inscription/edit-inscription.component';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InscriptionTafType } from '../taf-type/inscription-taf-type';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-inscription',
  standalone: true,
  imports: [FormsModule, NgSelectModule, NgbModalModule,CommonModule],
  templateUrl: './list-inscription.component.html',
  styleUrls: ['./list-inscription.component.css']
})
export class ListInscriptionComponent implements OnInit, OnDestroy {
  loading_get_inscription = false;
  loading_delete_inscription = false;
  les_inscriptions: InscriptionTafType[] = [];
  list: InscriptionTafType[] = [];
  filter: any = {
    text: [],
  };
  currentUser: any;

  constructor(public api: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    console.groupCollapsed("ListInscriptionComponent");
    this.currentUser = this.api.token.user_connected;
    this.get_inscription();
  }

  ngOnDestroy(): void {
    console.groupEnd();
  }

  get_inscription() {
    this.loading_get_inscription = true;
    this.api.taf_post("inscription/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_inscriptions = reponse.data;
        if (this.currentUser && this.currentUser.id_role === 2) {
          // Filtrer les inscriptions pour ne montrer que celles de l'utilisateur connecté
          this.les_inscriptions = this.les_inscriptions.filter(
            (inscription) => inscription.id_utilisateur === this.currentUser.id_utilisateur
          );
        }
        console.log("Opération effectuée avec succès sur la table inscription. Réponse= ", reponse);
        this.filter_change();
      } else {
        console.log("L'opération sur la table inscription a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_get_inscription = false;
    }, (error: any) => {
      this.loading_get_inscription = false;
      console.log("Erreur inconnue lors de la récupération des inscriptions: ", error);
      this.api.Swal_error("Erreur inconnue");
    });
  }

  filter_change(event?: any) {
    this.list = this.les_inscriptions.filter((one: any) => {
      let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/\s/g, '')
        .includes(event?.term?.toLowerCase().replace(/\s/g, ''));
      return search;
    });
  }

  async delete_inscription(inscription: InscriptionTafType) {
    // Afficher la boîte de dialogue de confirmation
    const result = await Swal.fire({
      title: `Confirmer la suppression de l'inscription #${inscription.id_inscription} ?`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      icon: 'question'
    });

    if (!result.isConfirmed) {
      return; // Annuler si l'utilisateur clique sur "Annuler"
    }

    this.loading_delete_inscription = true;
    this.api.taf_post("inscription/delete", inscription, (reponse: any) => {
      if (reponse.status) {
        console.log("Opération effectuée avec succès sur la table inscription. Réponse= ", reponse);
        this.get_inscription();
        this.api.Swal_success("Inscription supprimée avec succès");
      } else {
        console.log("L'opération sur la table inscription a échoué. Réponse= ", reponse);
        this.api.Swal_error("La suppression a échoué");
      }
      this.loading_delete_inscription = false;
    }, (error: any) => {
      console.log("Erreur inconnue! ", error);
      this.api.Swal_error("Erreur inconnue");
      this.loading_delete_inscription = false;
    });
  }

  openModal_add_inscription() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"
    };
    const modalRef = this.modalService.open(AddInscriptionComponent, { ...options, backdrop: 'static' });
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_inscription();
      }
    });
  }

  openModal_edit_inscription(one_inscription: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"
    };
    const modalRef = this.modalService.open(EditInscriptionComponent, { ...options, backdrop: 'static' });
    modalRef.componentInstance.inscription_to_edit = one_inscription;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_inscription();
      }
    });
  }
}
