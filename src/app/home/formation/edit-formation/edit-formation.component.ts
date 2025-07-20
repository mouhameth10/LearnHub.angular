import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormationTafType } from '../taf-type/formation-taf-type';

@Component({
  selector: 'app-edit-formation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './edit-formation.component.html',
  styleUrls: ['./edit-formation.component.css']
})
export class EditFormationComponent implements OnInit, OnDestroy {
  reactiveForm_edit_formation!: FormGroup;
  submitted: boolean = false;
  loading_edit_formation: boolean = false;
  @Input()
  formation_to_edit: FormationTafType = new FormationTafType();
  form_details: any = {};
  loading_get_details_edit_formation_form = false;

  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {}

 ngOnInit(): void {
  console.groupCollapsed("EditFormationComponent");
  this.get_details_edit_formation_form();
  // SUPPRIME cette ligne :
  // this.update_form(this.formation_to_edit);
}
  ngOnDestroy(): void {
    console.groupEnd();
  }

  // Mise à jour du formulaire
  update_form(formation_to_edit: any) {
  // Transforme la chaîne "6,7" en tableau pour le FormArray
 const animateurIds = (formation_to_edit.animateur || '')
  .split(',')
  .filter((id: string) => id)
  .map((id: string) => Number(id.trim())); // <-- ici

  this.reactiveForm_edit_formation = this.formBuilder.group({
    id_utilisateur: [formation_to_edit.id_utilisateur],
    animateur: this.formBuilder.array(
  animateurIds.length
    ? animateurIds.map((id: number) => this.formBuilder.control(id))
    : [this.formBuilder.control("")]

    ),
    domaine: [formation_to_edit.domaine],
    intitule: [formation_to_edit.intitule],
    lieu: [formation_to_edit.lieu],
    date_debut: [formation_to_edit.date_debut],
    date_fin: [formation_to_edit.date_fin],
    duree: [formation_to_edit.duree],
    montant: [formation_to_edit.montant],
    type_formation: [formation_to_edit.type_formation],
    fiche_programme: [formation_to_edit.fiche_programme],
    statut: [formation_to_edit.statut],
    etat: [formation_to_edit.etat],
    updated_at: [formation_to_edit.updated_at]
  });
}

  // Getter pour le FormArray animateur
  get animateurArray() {
    return this.reactiveForm_edit_formation.get('animateur') as FormArray;
  }

  // Ajouter un champ animateur
  addAnimateurField() {
    this.animateurArray.push(this.formBuilder.control(""));
  }

  // Retirer un champ animateur
  removeAnimateurField(index: number) {
    if (this.animateurArray.length > 1) {
      this.animateurArray.removeAt(index);
    }
  }

  // Accès facile aux champs du formulaire
  get f(): any { return this.reactiveForm_edit_formation.controls; }

  // Validation du formulaire
  onSubmit_edit_formation() {
    this.submitted = true;
    if (this.reactiveForm_edit_formation.invalid) {
      return;
    }
    var formation = this.reactiveForm_edit_formation.value;
    // Transforme le tableau en string
    if (Array.isArray(formation.animateur)) {
      formation.animateur = formation.animateur.filter((a: any) => a).join(',');
    }
    this.edit_formation({
      condition: { id_formation: this.formation_to_edit.id_formation },
      data: formation
    });
  }

  // Vider le formulaire
  onReset_edit_formation() {
    this.submitted = false;
    this.reactiveForm_edit_formation.reset();
  }

  edit_formation(formation: any) {
    this.loading_edit_formation = true;
    this.api.taf_post("formation/edit", formation, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse);
        console.log("Opération effectuée avec succès sur la table formation. Réponse= ", reponse);
        this.api.Swal_success("Opération éffectuée avec succès");
      } else {
        console.log("L'opération sur la table formation a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_edit_formation = false;
    }, (error: any) => {
      this.loading_edit_formation = false;
    });
  }

animateursList: any[] = [];

get_details_edit_formation_form() {
  this.loading_get_details_edit_formation_form = true;
  this.api.taf_post("formation/get_form_details", {}, (reponse: any) => {
    if (reponse.status) {
      this.form_details = reponse.data;
      this.animateursList = (this.form_details.les_utilisateurs || []).filter((u: any) => u.id_role === 3);
      console.log("Animateurs pour sélection :", this.animateursList);
      // APPELLE update_form ICI, quand la liste est prête :
      this.update_form(this.formation_to_edit);
    } else {
      this.api.Swal_error("L'opération a échoué");
    }
    this.loading_get_details_edit_formation_form = false;
  }, (error: any) => {
    this.loading_get_details_edit_formation_form = false;
  });
}
}
