import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';
import { Router } from '@angular/router';
import { FormationTafType } from '../taf-type/formation-taf-type';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-formation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-formation.component.html',
  styleUrls: ['./details-formation.component.css']
})
export class DetailsFormationComponent {
  @Input() formation: FormationTafType | undefined;
   @Input() animateursList: any[] = []; // <-- Ajouté ici
  loading_inscription: boolean = false;
  currentUser: any;

  constructor(
    public activeModal: NgbActiveModal,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.api.token.user_connected;
  }
 getAnimateurNoms(animateurStr: string): string[] {
    if (!animateurStr) return [];
    const ids = animateurStr.split(',').map(id => id.trim());
    return ids
      .map(id => {
        const user = this.animateursList?.find(u => u.id_utilisateur == id);
        return user ? user.username : id;
      })
      .filter(Boolean);
  }

  async registerToFormation() {
    if (!this.currentUser) {
      this.api.Swal_error("Veuillez vous connecter pour vous inscrire");
      this.router.navigate(['/login']);
      this.activeModal.dismiss('User not logged in');
      return;
    }

    if (!this.formation || !this.formation.id_formation) {
      this.api.Swal_error("Aucune formation sélectionnée");
      return;
    }

    // Afficher la boîte de dialogue de confirmation
    const result = await Swal.fire({
      title: `Confirmer votre inscription à "${this.formation.intitule}" ?`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      icon: 'question'
    });

    if (!result.isConfirmed) {
      return; // Annuler si l'utilisateur clique sur "Annuler"
    }

    const inscription = {
      id_formation: this.formation.id_formation,
      id_utilisateur: this.currentUser.id_utilisateur,
      date_inscription: new Date().toISOString().slice(0, 16),
      statut: 'En attente',
      etat: 0
    };

    this.loading_inscription = true;
    this.api.taf_post("inscription/add", inscription, (reponse: any) => {
      this.loading_inscription = false;
      if (reponse.status) {
        console.log("Inscription enregistrée avec succès. Réponse= ", reponse);
        this.api.Swal_success("Inscription réussie !");
        this.activeModal.close(reponse);
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
