import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hero } from '../../models/hero/hero';
import { HeroService } from '../../services/hero.service/hero.service';


@Component({
  selector: 'my-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: [ './heroes.component.css' ]
})

//Public Properties exposes these things for 1 and 2 way binding

export class template implements OnInit {
  ngOnInit(): void {
    //do something
  };

  /*
    heroes: Hero[];
    selectedHero : Hero;
    constructor(
      private name: model,
    ) { };

    getHeroes(): void{
      this.heroService.getHeroesSlowly().then(heroes => this.heroes = heroes);
    };
    gotoDetail(): void {
      this.router.navigate(['/detail', this.selectedHero.id]);
    };
    onSelect(hero: Hero): void {
      //this.selectedHero = hero;
      this.router.navigate(['/detail', hero.id]);
    };
    add(name: string): void {
      name = name.trim();
      if (!name) { return; }
      this.heroService.create(name)
        .then(hero => {
          this.heroes.push(hero);
          this.selectedHero = null;
        });
    }
    delete(hero: Hero): void {
      this.heroService
          .delete(hero.id)
          .then(() => {
            this.heroes = this.heroes.filter(h => h !== hero);
            if (this.selectedHero === hero) { this.selectedHero = null; }
          });
    }
    */
  }
