import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deconnexion',
  templateUrl: './deconnexion.component.html',
  styleUrls: ['./deconnexion.component.css']
})
export class DeconnexionComponent {
  constructor(
    public api: ApiService,
    private route: Router,
    public modalService: NgbActiveModal
  ) {}

  // Méthode de déconnexion qui se déclenche lorsque "Oui" est cliqué
  async deconnexion() {
    // Simuler la déconnexion
    this.api.network = {
      token: undefined,
      status: true,
      message: "Aucun problème détecté",
    };

    await this.api.delete_from_local_storage('token');
    this.route.navigateByUrl('/public/login'); // Redirige après déconnexion
    this.modalService.close('deconnexion'); // Ferme le modal et retourne un résultat
  }

  // Méthode pour fermer le modal sans effectuer la déconnexion
  closeModal() {
    this.modalService.close('annulee'); // Ferme le modal et retourne un autre résultat
  }
}
