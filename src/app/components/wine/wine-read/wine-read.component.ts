import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { HeaderService } from './../../template/header/header.service';
import { MatTableDataSource } from '@angular/material/table';
import { WineService } from './../../../services/wine.service';
import { Wine } from './../../../models/wine.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

const { apiUrl } = environment;

@Component({
    selector: 'app-wine-read',
    templateUrl: './wine-read.component.html',
    styleUrls: ['./wine-read.component.css']
})
export class WineReadComponent implements OnInit {

    wines: Wine[] = []
    filters = [
        { type: 'filteredTitles', attribute: 'title', control: 'pais' }, 
        { type: 'filteredDevelopers', attribute: 'developer', control: 'tipoVinho' },
        { type:'filteredGenres', attribute: 'genre', control: 'tipoUva' }
    ]
    dataSource: any
    statusTable: boolean

    pais = new FormControl();
    tipoVinho = new FormControl();
    tipoUva = new FormControl();

    filteredDevelopers: any;
    filteredTitles: any;
    filteredGenres: any;
    newFilters = []

    constructor(
        private wineService: WineService, 
        private headerService: HeaderService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.wineService.read().subscribe(wines => {
            this.wines = wines
            console.log(this.wines)
            this.filters.map(filter => this._multiFilters(filter.type, filter.attribute, filter.control))
        })
        this.statusTable = true
    }

    transformImageUrl(imageUrl?: string): string {
        return imageUrl.slice(0, 4) === 'http' ? imageUrl : `${apiUrl}/${imageUrl}`;
    }

    displayPais(wine: Wine): string {
        return wine && wine.country ? wine.country : '';
    }

    displayVinho(wine: Wine): string {
        return wine && wine.type ? wine.type : '';
    }
    
    displayUva(wine: Wine): string {
        return wine && wine.type_grape ? wine.type_grape : '';
    }

    private _filter(name: any, attribute: string): Wine[] {
        const filterValue = name.toLowerCase();
        return this.newFilters.filter(option => option[attribute].toLowerCase().indexOf(filterValue) === 0);
    }

    private _prepareValuesToFilter(attribute: string): Wine[] {
        this.newFilters = this.wines.filter((item, index, self) => index === self.findIndex(i => (i[attribute] === item[attribute]) ) );
        return this.newFilters;
    }

    private _multiFilters(filterType: string, filterAttribute: string, filterControl:string) {
        this[filterType] = this[filterControl].valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value[filterAttribute]),
                map(name => name ? this._filter(name, filterAttribute) : this._prepareValuesToFilter(filterAttribute))
            );
    }

    applyFilter(filter: string) {
        console.log("filter");
        this.statusTable = false
        this.dataSource = new MatTableDataSource(this.wines)
        this.dataSource.filter = filter.trim().toLowerCase();
    }

    get username(): string {
        return this.headerService.headerData.username
    }

    get user_id(): string {
        return localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).id : null
    }

    navegarReview(wine: Wine): void {
        this.router.navigate([`/top/${wine.id}`])
    }
}
