import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {

  constructor(private _http: HttpClient) { }

  getAllPets(){
   return this._http.get('/show-all');
 }
 getOnePet(id) {
      return this._http.get('/pets/' + id);
  }

  new(pet) {
    return this._http.post('/new', pet);
  }

  delete(id) {
    console.log("about to delete pet:", id);
    return this._http.delete(`/delete/${id}`);
  }

  updatePet(id, updatedPet) {
    console.log("in the service")
    return this._http.put(`/updatepet/${id}`, updatedPet);
  }


   updateLikes(pet) { // updated object gets sent with ID and entire obj
     console.log("IN THE SERVICE:", pet)
       return this._http.put(`/pets/${pet._id}/like`, pet);
   }
}
