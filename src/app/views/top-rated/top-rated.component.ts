import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Wine } from "src/app/models/wine.model";
import { WineService } from '../../services/wine.service';
import { HeaderService } from './../../components/template/header/header.service';

const { apiUrl } = environment;

@Component({
  selector: 'app-top-rated',
  templateUrl: './top-rated.component.html',
  styleUrls: ['./top-rated.component.css']
})
export class TopRatedComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private wineService: WineService, 
    private headerService: HeaderService,
    private router: Router,
  ) { 
    Object.assign(headerService.headerData, {
      title: 'Top wines',
      icon: 'star_border',
      routeUrl: '/top'
    })
  }

  wine: Wine;
  showSpinner = false

  ngOnInit(): void {
    this.showSpinner = true
    const id = +this.route.snapshot.paramMap.get('id')
    this.wineService.readById(id).subscribe(wine => {
      this.wine = wine
      this.showSpinner = false
      console.log(this.wine);
    });
  }

  transformImageUrl(imageUrl?: string): string {
    return imageUrl.slice(0, 4) === 'http' ? imageUrl : `${apiUrl}/${imageUrl}`;
  }

  voltar(): void {
    this.router.navigate(['/wines'])
  }

}
