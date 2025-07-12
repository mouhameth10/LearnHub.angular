import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/public/login']);
  }

  topFormations = [
    {
      intitule: 'Initiation au développement web',
      lieu: 'Dakar',
      date_debut: '2025-08-01',
      date_fin: '2025-08-15',
      montant: 50000
    },
    {
      intitule: 'Gestion de projet Agile',
      lieu: 'Thiès',
      date_debut: '2025-08-05',
      date_fin: '2025-08-20',
      montant: 65000
    },
    {
      intitule: 'Excel Avancé',
      lieu: 'En ligne',
      date_debut: '2025-09-01',
      date_fin: '2025-09-10',
      montant: 40000
    }
  ];

  temoignages = [
    {
      nom: 'Awa Diop',
      profession: 'Comptable',
      message: 'Une expérience enrichissante et des formateurs de qualité !'
    },
    {
      nom: 'Mamadou Sarr',
      profession: 'Développeur Web',
      message: 'J’ai pu renforcer mes compétences grâce aux cours bien structurés.'
    },
    {
      nom: 'Fatou Ndiaye',
      profession: 'Étudiante',
      message: 'Inscription facile et accès rapide aux cours. Super !'
    }
  ];

  goToFormation(formation: any) {
    console.log('Formation sélectionnée :', formation);
    this.router.navigate(['/public/login']);
  }
}
