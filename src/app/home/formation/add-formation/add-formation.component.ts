import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormArray } from '@angular/forms';
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
  animateursList: any[] = []; // Pour stocker les animateurs
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

 ngOnInit(): void {
  this.currentUser = this.api.token.user_connected
  console.groupCollapsed("AddFormationComponent");
  this.get_details_add_formation_form();
}

get_details_add_formation_form() {
  this.loading_get_details_add_formation_form = true;
  this.api.taf_post("formation/get_form_details", {}, (reponse: any) => {
    console.log('Réponse brute formation/get_form_details', reponse);
    if (reponse.status) {
      this.form_details = reponse.data;
      // Correction ici : utilisez 'les_utilisateurs'
      this.animateursList = (this.form_details.les_utilisateurs || []).filter((u: any) => u.id_role === 3);
      console.log('animateursList', this.animateursList);
      this.init_form();
    } else {
      this.api.Swal_error("L'opération a echoué")
    }
    this.loading_get_details_add_formation_form = false;
  }, (error: any) => {
    this.loading_get_details_add_formation_form = false;
    console.error('Erreur API formation/get_form_details', error);
  })
}
  ngOnDestroy(): void {
    console.groupEnd();
  }
init_form() {
    this.reactiveForm_add_formation  = this.formBuilder.group({
        id_utilisateur: [this.currentUser.id_utilisateur],
        animateur: this.formBuilder.array([this.formBuilder.control("")]), // FormArray
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
    // Transforme le tableau en string si besoin
    if (Array.isArray(formation.animateur)) {
        formation.animateur = formation.animateur.filter((a: any) => a).join(',');
        console.log('Animateur transformé en string:', formation.animateur);
    }
    // Vérification du champ statut
    if (!formation.statut) {
        formation.statut = '';
        console.log('Champ statut ajouté vide');
    }
    this.loading_add_formation = true;
    console.log('Donnée envoyée à l\'API formation/add :', formation);

    this.api.taf_post("formation/add", formation, (reponse: any) => {
        this.loading_add_formation = false;
        console.log("Réponse API formation/add :", reponse);

        if (reponse.status) {
            console.log("Opération effectuée avec succès sur la table formation. Réponse= ", reponse);
            this.onReset_add_formation()
            this.api.Swal_success("Opération éffectuée avec succés")
            this.activeModal.close(reponse)
        } else {
            console.log("L'opération sur la table formation a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
        }
    }, (error: any) => {
        this.loading_add_formation = false;
        console.error('Erreur lors de l\'appel à formation/add :', error);
    })
}
get animateurArray() {
    return this.reactiveForm_add_formation.get('animateur') as FormArray;
}

addAnimateurField() {
    this.animateurArray.push(this.formBuilder.control(""));
}

removeAnimateurField(index: number) {
    if (this.animateurArray.length > 1) {
        this.animateurArray.removeAt(index);
    }
}

//  get_details_add_formation_form() {
//     this.loading_get_details_add_formation_form = true;
//     this.api.taf_post("formation/get_form_details", {}, (reponse: any) => {
//       if (reponse.status) {
//         this.form_details = reponse.data;
//         // Filtrer les utilisateurs avec id_role = 3
//         this.animateursList = (this.form_details.utilisateurs || []).filter((u: any) => u.id_role === 3);
//          console.log('animateursList', this.animateursList); // <-- Ajoutez ceci
//       } else {
//         this.api.Swal_error("L'opération a echoué")
//       }
//       this.loading_get_details_add_formation_form = false;
//     }, (error: any) => {
//       this.loading_get_details_add_formation_form = false;
//     })
// }
}
