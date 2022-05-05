import { Component, HostListener, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.component.html',
  styleUrls: ['./conductor.component.css'],
  animations: [
    trigger('play', [
      state('waiting', style({
        left: '0px',
      })),
      state('finished', style({
        left: '100%',
      })),
      transition('waiting => finished', [
        animate('60s')
      ]),
    ])
  ]
})
export class ConductorComponent implements OnInit {

  isPlaying: boolean = false;
  public height:number;

  constructor() {
    this.height = 0;
  }

  play($event:boolean) {
    this.isPlaying = $event;
  }
  

  ngOnInit(): void {
    this.height = window.innerHeight - (0.05 * window.innerHeight);
    console.log(this.height);
  }

  @HostListener('window:resize', ['$event'])  
  onResize(event: any) {  
    this.height = window.innerHeight - (0.05 * window.innerHeight);
  }  

}
