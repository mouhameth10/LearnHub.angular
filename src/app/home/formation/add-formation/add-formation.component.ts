import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormationTafType } from '../taf-type/formation-taf-type';
@Component({
  selector: 'app-add-formation',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-formation.component.html',
  styleUrls: ['./add-formation.component.css']
})
export class AddFormationComponent implements OnInit, OnDestroy {
  reactiveForm_add_formation !: FormGroup;
  submitted:boolean=false
  loading_add_formation :boolean=false
  form_details: any = {}
  loading_get_details_add_formation_form = false
  currentUser: any
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.currentUser = this.api.token.user_connected
      console.groupCollapsed("AddFormationComponent");
      this.get_details_add_formation_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_formation  = this.formBuilder.group({
          id_utilisateur: [this.currentUser.id_utilisateur],
domaine: [""],
intitule: [""],
lieu: [""],
date_debut: [""],
date_fin: [""],
duree: [""],
montant: [""],
type_formation: [""],
fiche_programme: [""],
statut: [""],
etat: [0],
updated_at: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_formation .controls; }
  // validation du formulaire
  onSubmit_add_formation () {
      this.submitted = true;
      console.log(this.reactiveForm_add_formation .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_formation .invalid) {
          return;
      }
      var formation =this.reactiveForm_add_formation .value
      this.add_formation (formation )
  }
  // vider le formulaire
  onReset_add_formation () {
      this.submitted = false;
      this.reactiveForm_add_formation .reset();
  }
  add_formation(formation: any) {
      this.loading_add_formation = true;
      this.api.taf_post("formation/add", formation, (reponse: any) => {
      this.loading_add_formation = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table formation. Réponse= ", reponse);
          this.onReset_add_formation()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table formation a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_formation = false;
    })
  }

  get_details_add_formation_form() {
      this.loading_get_details_add_formation_form = true;
      this.api.taf_post("formation/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table formation. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table formation a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_formation_form = false;
      }, (error: any) => {
      this.loading_get_details_add_formation_form = false;
    })
  }
}
