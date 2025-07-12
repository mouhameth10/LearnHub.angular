import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UtilisateurTafType } from '../../home/utilisateur/taf-type/utilisateur-taf-type';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit, OnDestroy {
  reactiveForm_inscription!: FormGroup;
  submitted: boolean = false;
  loading_inscription: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.groupCollapsed("InscriptionComponent");
    this.init_form();
  }

  ngOnDestroy(): void {
    console.groupEnd();
  }

  init_form() {
    this.reactiveForm_inscription = this.formBuilder.group({
     username: [""],
adresse: [""],
telephone: [""],
email: [""],
password: [""],
statut: ["actif"],
etat: [0],
updated_at: [""],
      id_role: [2] // Rôle "Participant" par défaut
    });
  }

  get f(): any { return this.reactiveForm_inscription.controls; }

  onSubmit_inscription() {
    this.submitted = true;
    if (this.reactiveForm_inscription.invalid) {
      return;
    }
    const utilisateur = this.reactiveForm_inscription.value;
    this.add_utilisateur(utilisateur);
  }

  onReset_inscription() {
    this.submitted = false;
    this.reactiveForm_inscription.reset({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      telephone: '',
      id_role: 2
    });
  }

  add_utilisateur(utilisateur: UtilisateurTafType) {
    this.loading_inscription = true;
    this.api.taf_post("utilisateur/add", utilisateur, (reponse: any) => {
      this.loading_inscription = false;
      if (reponse.status) {
        console.log("Utilisateur inscrit avec succès. Réponse= ", reponse);
        this.onReset_inscription();
        this.api.Swal_success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        this.router.navigate(['/login']);
      } else {
        console.log("Échec de l'inscription. Réponse= ", reponse);
        this.api.Swal_error("L'inscription a échoué");
      }
    }, (error: any) => {
      this.loading_inscription = false;
      console.log("Erreur inconnue lors de l'inscription: ", error);
      this.api.Swal_error("Erreur inconnue");
    });
  }
}
