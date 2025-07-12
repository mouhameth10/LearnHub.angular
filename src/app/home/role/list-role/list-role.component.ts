import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddRoleComponent } from '../add-role/add-role.component';
  import { EditRoleComponent } from '../edit-role/edit-role.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { RoleTafType } from '../taf-type/role-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-role',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-role.component.html',
    styleUrls: ['./list-role.component.css']
  })
  export class ListRoleComponent implements OnInit, OnDestroy{
    loading_get_role = false
    loading_delete_role = false
    les_roles: RoleTafType[] = []
    list: RoleTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListRoleComponent");
      this.get_role()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_role() {
      this.loading_get_role = true;
      this.api.taf_post("role/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_roles = reponse.data
          console.log("Opération effectuée avec succés sur la table role. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table role a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_role = false;
      }, (error: any) => {
        this.loading_get_role = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_roles.filter((one: any) => {
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
    delete_role (role : any){
      this.loading_delete_role = true;
      this.api.taf_post("role/delete", role,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table role . Réponse = ",reponse)
          this.get_role()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table role  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_role = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_role = false;
      })
    }
    openModal_add_role() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddRoleComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_role()
        } else {

        }
      })
    }
    openModal_edit_role(one_role: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditRoleComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.role_to_edit = one_role;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_role()
        } else {

        }
      })
    }
  }