import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Leaders } from '../shared/leaders';
@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }
  
  getLeaders(): Promise<Leader []>{
    return Promise.resolve(Leaders);
  }

  getFeaturedLeader(): Promise <Leader> {
    return Promise.resolve(Leaders.filter(leader=>leader.featured)[0]);
  }
}
