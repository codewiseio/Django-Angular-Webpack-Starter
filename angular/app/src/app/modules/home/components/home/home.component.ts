import { Component, OnInit } from '@angular/core';
import { slideIn, shrinkOut } from '../../../../animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [ slideIn, shrinkOut ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
