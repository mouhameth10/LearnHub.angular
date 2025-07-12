import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InscriptionTafType } from '../taf-type/inscription-taf-type';
@Component({
  selector: 'app-add-inscription',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-inscription.component.html',
  styleUrls: ['./add-inscription.component.css']
})
export class AddInscriptionComponent implements OnInit, OnDestroy {
  reactiveForm_add_inscription !: FormGroup;
  submitted:boolean=false
  loading_add_inscription :boolean=false
  form_details: any = {}
  loading_get_details_add_inscription_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddInscriptionComponent");
      this.get_details_add_inscription_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_inscription  = this.formBuilder.group({
          id_formation: [""],
id_utilisateur: [""],
date_inscription: [""],
statut: [""],
etat: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_inscription .controls; }
  // validation du formulaire
  onSubmit_add_inscription () {
      this.submitted = true;
      console.log(this.reactiveForm_add_inscription .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_inscription .invalid) {
          return;
      }
      var inscription =this.reactiveForm_add_inscription .value
      this.add_inscription (inscription )
  }
  // vider le formulaire
  onReset_add_inscription () {
      this.submitted = false;
      this.reactiveForm_add_inscription .reset();
  }
  add_inscription(inscription: any) {
      this.loading_add_inscription = true;
      this.api.taf_post("inscription/add", inscription, (reponse: any) => {
      this.loading_add_inscription = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table inscription. Réponse= ", reponse);
          this.onReset_add_inscription()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table inscription a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_inscription = false;
    })
  }
  
  get_details_add_inscription_form() {
      this.loading_get_details_add_inscription_form = true;
      this.api.taf_post("inscription/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table inscription. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table inscription a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_inscription_form = false;
      }, (error: any) => {
      this.loading_get_details_add_inscription_form = false;
    })
  }
}
