import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  pet: any;
  params:any;
  liked=true;
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
        this.pet = data; //put data into pet objects
        console.log("this pet: ", this.pet);
      }); // subscribe
    }

    delete(id){
      let observable = this._httpService.delete(id);
      observable.subscribe( data => {
        console.log("deleting pet", this.pet);
        this._router.navigate(['home']);
      });
    }


  likePet(pet) { // send the entire object!
    console.log("IN THE COMPONENT")
    pet.likes += 1; // update just this property in the object
    console.log("likes:", pet.likes)
    let observable = this._httpService.updateLikes(pet); // send the newly updated obj to service
    observable.subscribe(dish => {
      console.log("upvoting dish", this.pet);
      //go to another route?
      this.liked=false;
      this._router.navigate(['/details/', this.params.id]);
    })
  }
}
