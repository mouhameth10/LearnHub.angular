import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormationTafType } from '../taf-type/formation-taf-type';
@Component({
  selector: 'app-edit-formation',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-formation.component.html',
  styleUrls: ['./edit-formation.component.css']
})
export class EditFormationComponent implements OnInit, OnDestroy {
  reactiveForm_edit_formation !: FormGroup;
  submitted: boolean = false
  loading_edit_formation: boolean = false
  @Input()
  formation_to_edit: FormationTafType = new FormationTafType();
  form_details: any = {}
  loading_get_details_edit_formation_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditFormationComponent");
      this.get_details_edit_formation_form()
      this.update_form(this.formation_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(formation_to_edit:any) {
      this.reactiveForm_edit_formation = this.formBuilder.group({
          id_utilisateur : [formation_to_edit.id_utilisateur],
domaine : [formation_to_edit.domaine],
intitule : [formation_to_edit.intitule],
lieu : [formation_to_edit.lieu],
date_debut : [formation_to_edit.date_debut],
date_fin : [formation_to_edit.date_fin],
duree : [formation_to_edit.duree],
montant : [formation_to_edit.montant],
type_formation : [formation_to_edit.type_formation],
fiche_programme : [formation_to_edit.fiche_programme],
statut : [formation_to_edit.statut],
etat : [formation_to_edit.etat],
updated_at : [formation_to_edit.updated_at]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_formation .controls; }
  // validation du formulaire
  onSubmit_edit_formation() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_formation.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_formation.invalid) {
          return;
      }
      var formation = this.reactiveForm_edit_formation.value
      this.edit_formation({
      condition:{id_formation:this.formation_to_edit.id_formation},
      data:formation
      })
  }
  // vider le formulaire
  onReset_edit_formation() {
      this.submitted = false;
      this.reactiveForm_edit_formation.reset();
  }
  edit_formation(formation: any) {
      this.loading_edit_formation = true;
      this.api.taf_post("formation/edit", formation, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table formation. Réponse= ", reponse);
              //this.onReset_edit_formation()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table formation a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_formation = false;
      }, (error: any) => {
          this.loading_edit_formation = false;
      })
  }
  get_details_edit_formation_form() {
      this.loading_get_details_edit_formation_form = true;
      this.api.taf_post("formation/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table formation. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table formation a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_formation_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_formation_form = false;
    })
  }
}