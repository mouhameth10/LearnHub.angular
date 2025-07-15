import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ import du Router

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  utilisateur: any = {};
  loading: boolean = true;
  error: string = '';
  passwordForm!: FormGroup;
  submitted: boolean = false;
  loadingPasswordChange: boolean = false;
  loading_delete_utilisateur: boolean = false;

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router // ✅ injection du Router
  ) {}

  ngOnInit(): void {
    console.log('Initialisation du composant ProfileComponent');
    this.getutilisateurData();
    this.initPasswordForm();
  }

  initPasswordForm() {
    console.log('Initialisation du formulaire de modification du mot de passe');
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.matchPasswords
    });
  }

  matchPasswords(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { notMatching: true };
  }

  get f() {
    return this.passwordForm.controls;
  }

  getutilisateurData() {
    console.log('Récupération des données utilisateur...');
    this.api.get_token().then(() => {
      this.utilisateur = this.api.token.user_connected;
      console.log('Données utilisateur récupérées :', this.utilisateur);
      this.loading = false;
    }).catch((error) => {
      console.error('Erreur lors de la récupération des données utilisateur :', error);
      this.error = "Impossible de récupérer les données utilisateur.";
      this.loading = false;
    });
  }

  onSubmitPasswordChange() {
    console.log('Soumission du formulaire de modification du mot de passe');
    this.submitted = true;

    if (this.passwordForm.invalid) {
      console.warn('Le formulaire est invalide :', this.passwordForm.errors);
      return;
    }

    this.loadingPasswordChange = true;

    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;

    this.api.taf_post(
      'utilisateur/change-password.php',
      {
        condition: JSON.stringify({ id_utilisateur: this.utilisateur.id_utilisateur }),
        data: JSON.stringify({ password: newPassword }),
        currentPassword: currentPassword
      },
      (response: any) => {
        this.loadingPasswordChange = false;

        if (response.status) {
          this.api.Swal_success('Mot de passe modifié avec succès.');
          this.passwordForm.reset();
          this.submitted = false;
        } else {
          this.api.Swal_error(response.erreur || 'Erreur lors de la modification du mot de passe.');
        }
      },
      (error: any) => {
        this.loadingPasswordChange = false;
        console.error('Erreur lors du changement de mot de passe :', error);
        this.api.Swal_error('Erreur réseau ou serveur. Veuillez réessayer.');
      }
    );
  }

  confirmAccountDeletion() {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.');
    if (confirmDelete) {
      this.deleteAccount();
    }
  }

  deleteAccount() {
    this.delete_utilisateur(this.utilisateur);
  }

  delete_utilisateur(utilisateur: any) {
    this.loading_delete_utilisateur = true;
    this.api.taf_post("utilisateur/delete.php", utilisateur, (reponse: any) => {
      if (reponse.status) {
        console.log("Utilisateur supprimé avec succès :", reponse);

        // ✅ Optionnel : Réinitialiser les données utilisateur
        this.api.token = null;

        this.api.Swal_success("Compte supprimé avec succès.");

        // ✅ Redirection après une petite pause pour laisser le message apparaître
        setTimeout(() => {
          this.router.navigate(['/public/login']); // ← Redirige vers la page d'accueil
        }, 1000);
      } else {
        console.log("Échec de la suppression de l'utilisateur. Réponse :", reponse);
        this.api.Swal_error("Échec de la suppression de l'utilisateur.");
      }
      this.loading_delete_utilisateur = false;
    }, (error: any) => {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      this.loading_delete_utilisateur = false;
    });
  }
}
