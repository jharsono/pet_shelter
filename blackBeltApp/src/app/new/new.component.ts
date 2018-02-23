import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  newPet: any;
  validationError: any;
  constructor(private _httpService: HttpService, private router: Router){ }

  ngOnInit() {
    this.newPet = {};
  }

  addPet(){
    console.log(this.newPet);
    let observable = this._httpService.new(this.newPet); //pass the newTask into service
    observable.subscribe(response => {
    let pet = response as any;
      console.log("adding a pet", pet)
      if (pet.error) {
        this.validationError = pet.error.errors.text.message;
      }
      this.router.navigate(['/home']);

    })
  }

}
