import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoleTafType } from '../taf-type/role-taf-type';
@Component({
  selector: 'app-add-role',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit, OnDestroy {
  reactiveForm_add_role !: FormGroup;
  submitted:boolean=false
  loading_add_role :boolean=false
  form_details: any = {}
  loading_get_details_add_role_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddRoleComponent");
      this.get_details_add_role_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_role  = this.formBuilder.group({
          nom_role: [""],
description: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_role .controls; }
  // validation du formulaire
  onSubmit_add_role () {
      this.submitted = true;
      console.log(this.reactiveForm_add_role .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_role .invalid) {
          return;
      }
      var role =this.reactiveForm_add_role .value
      this.add_role (role )
  }
  // vider le formulaire
  onReset_add_role () {
      this.submitted = false;
      this.reactiveForm_add_role .reset();
  }
  add_role(role: any) {
      this.loading_add_role = true;
      this.api.taf_post("role/add", role, (reponse: any) => {
      this.loading_add_role = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table role. Réponse= ", reponse);
          this.onReset_add_role()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table role a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_role = false;
    })
  }
  
  get_details_add_role_form() {
      this.loading_get_details_add_role_form = true;
      this.api.taf_post("role/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table role. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table role a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_role_form = false;
      }, (error: any) => {
      this.loading_get_details_add_role_form = false;
    })
  }
}
