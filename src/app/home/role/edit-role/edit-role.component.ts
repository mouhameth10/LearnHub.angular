import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoleTafType } from '../taf-type/role-taf-type';
@Component({
  selector: 'app-edit-role',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit, OnDestroy {
  reactiveForm_edit_role !: FormGroup;
  submitted: boolean = false
  loading_edit_role: boolean = false
  @Input()
  role_to_edit: RoleTafType = new RoleTafType();
  form_details: any = {}
  loading_get_details_edit_role_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditRoleComponent");
      this.get_details_edit_role_form()
      this.update_form(this.role_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(role_to_edit:any) {
      this.reactiveForm_edit_role = this.formBuilder.group({
          nom_role : [role_to_edit.nom_role],
description : [role_to_edit.description]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_role .controls; }
  // validation du formulaire
  onSubmit_edit_role() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_role.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_role.invalid) {
          return;
      }
      var role = this.reactiveForm_edit_role.value
      this.edit_role({
      condition:{id_role:this.role_to_edit.id_role},
      data:role
      })
  }
  // vider le formulaire
  onReset_edit_role() {
      this.submitted = false;
      this.reactiveForm_edit_role.reset();
  }
  edit_role(role: any) {
      this.loading_edit_role = true;
      this.api.taf_post("role/edit", role, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table role. Réponse= ", reponse);
              //this.onReset_edit_role()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table role a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_role = false;
      }, (error: any) => {
          this.loading_edit_role = false;
      })
  }
  get_details_edit_role_form() {
      this.loading_get_details_edit_role_form = true;
      this.api.taf_post("role/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table role. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table role a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_role_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_role_form = false;
    })
  }
}