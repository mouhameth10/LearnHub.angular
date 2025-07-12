import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InscriptionTafType } from '../taf-type/inscription-taf-type';
@Component({
  selector: 'app-edit-inscription',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-inscription.component.html',
  styleUrls: ['./edit-inscription.component.css']
})
export class EditInscriptionComponent implements OnInit, OnDestroy {
  reactiveForm_edit_inscription !: FormGroup;
  submitted: boolean = false
  loading_edit_inscription: boolean = false
  @Input()
  inscription_to_edit: InscriptionTafType = new InscriptionTafType();
  form_details: any = {}
  loading_get_details_edit_inscription_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditInscriptionComponent");
      this.get_details_edit_inscription_form()
      this.update_form(this.inscription_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(inscription_to_edit:any) {
      this.reactiveForm_edit_inscription = this.formBuilder.group({
          id_formation : [inscription_to_edit.id_formation],
id_utilisateur : [inscription_to_edit.id_utilisateur],
date_inscription : [inscription_to_edit.date_inscription],
statut : [inscription_to_edit.statut],
etat : [inscription_to_edit.etat]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_inscription .controls; }
  // validation du formulaire
  onSubmit_edit_inscription() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_inscription.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_inscription.invalid) {
          return;
      }
      var inscription = this.reactiveForm_edit_inscription.value
      this.edit_inscription({
      condition:{id_inscription:this.inscription_to_edit.id_inscription},
      data:inscription
      })
  }
  // vider le formulaire
  onReset_edit_inscription() {
      this.submitted = false;
      this.reactiveForm_edit_inscription.reset();
  }
  edit_inscription(inscription: any) {
      this.loading_edit_inscription = true;
      this.api.taf_post("inscription/edit", inscription, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table inscription. Réponse= ", reponse);
              //this.onReset_edit_inscription()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table inscription a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_inscription = false;
      }, (error: any) => {
          this.loading_edit_inscription = false;
      })
  }
  get_details_edit_inscription_form() {
      this.loading_get_details_edit_inscription_form = true;
      this.api.taf_post("inscription/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table inscription. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table inscription a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_inscription_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_inscription_form = false;
    })
  }
}