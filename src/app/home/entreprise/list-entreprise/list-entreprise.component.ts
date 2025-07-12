import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddEntrepriseComponent } from '../add-entreprise/add-entreprise.component';
  import { EditEntrepriseComponent } from '../edit-entreprise/edit-entreprise.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { EntrepriseTafType } from '../taf-type/entreprise-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-entreprise',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-entreprise.component.html',
    styleUrls: ['./list-entreprise.component.css']
  })
  export class ListEntrepriseComponent implements OnInit, OnDestroy{
    loading_get_entreprise = false
    loading_delete_entreprise = false
    les_entreprises: EntrepriseTafType[] = []
    list: EntrepriseTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListEntrepriseComponent");
      this.get_entreprise()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_entreprise() {
      this.loading_get_entreprise = true;
      this.api.taf_post("entreprise/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_entreprises = reponse.data
          console.log("Opération effectuée avec succés sur la table entreprise. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table entreprise a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_entreprise = false;
      }, (error: any) => {
        this.loading_get_entreprise = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_entreprises.filter((one: any) => {
        let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
          .includes(event?.term?.toLowerCase().replace(/s/g, ''))
        // filtre complexe
        // let filtre_objet: any = {}
        // let text = !this.filter.text || this.filter.text.length == 0
        //   || this.filter.text.filter((one_filtre: string) => {
        //     let domaine = !one_filtre.startsWith('domaine_') || (one_filtre.startsWith('domaine_') && one_filtre.replace('domaine_', '') == one.id_domaine)
        //     let zone = !one_filtre.startsWith('zone_') || (one_filtre.startsWith('zone_') && one_filtre.replace('zone_', '') == one.id_zone)

        //     // Incrémenter les compteurs
        //     if (one_filtre.startsWith('domaine_')) filtre_objet.domaine_ = (filtre_objet.domaine_ || 0) + 1
        //     if (one_filtre.startsWith('zone_')) filtre_objet.zone_ = (filtre_objet.zone_ || 0) + 1
        //     return domaine && zone
        //   }).length >= Object.keys(filtre_objet).length

        return search// && text
      })
    }
    delete_entreprise (entreprise : any){
      this.loading_delete_entreprise = true;
      this.api.taf_post("entreprise/delete", entreprise,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table entreprise . Réponse = ",reponse)
          this.get_entreprise()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table entreprise  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_entreprise = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_entreprise = false;
      })
    }
    openModal_add_entreprise() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddEntrepriseComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_entreprise()
        } else {

        }
      })
    }
    openModal_edit_entreprise(one_entreprise: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditEntrepriseComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.entreprise_to_edit = one_entreprise;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_entreprise()
        } else {

        }
      })
    }
  }