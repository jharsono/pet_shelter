import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  pet: any;
  params:any;
    constructor(private _httpService: HttpService,
              private _route: ActivatedRoute,
              private _router: Router
        ){ }

  ngOnInit() {
    this.pet = {}
    this._route.params.subscribe((params: Params) => this.params= params);
    this.getOnePet(this.params.id);

  }
  getOnePet(id) {
    let observable = this._httpService.getOnePet(id); //getAuthor is invoked from http.service
    observable.subscribe(data => {
        console.log("Got our data!", data);
        this.pet = data; //put data into author objects
        console.log("this pet: ", this.pet);
      }); // subscribe
    }

    updatePet(id){
      console.log("NEW COUNTRY INFO:", this.pet);
      console.log("id:", id);
      let observable = this._httpService.updatePet(id, this.pet);
      observable.subscribe(pet => {
        console.log("editing pet", this.pet);
        //go to another route?
        this._router.navigate(['home']);
      })
    }


}
