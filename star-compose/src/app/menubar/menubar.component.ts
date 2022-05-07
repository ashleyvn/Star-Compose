import {SynthService} from '../_services/tone.service';
import { Component, OnInit, Output, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';
import { Constellation } from '../_models/constellation.model';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  @Output() buttonPressed = new EventEmitter<boolean>();
  @HostBinding('class.navbar-opened') navbarOpened = false;  
  @Input() constellations:Constellation[] = [];
  @Input() locationConstellations:Constellation[] = [];
  @Output() renderAudio = new EventEmitter<boolean>();
  @Output() onSelected = new EventEmitter<any>();
  playStatus = "Play"

  constructor( private synth: SynthService ) {}

  runConductor() {
    if (this.playStatus === "Play") {
      // chnage button to stop and start audio
      this.playStatus = "Stop";
      this.buttonPressed.emit(true);
      this.renderAudio.emit(true);
      this.hideIcons("hidden")
    }
    else if (this.playStatus === "Stop") {
      this.playStatus = "Play"
      this.buttonPressed.emit(false);
      this.renderAudio.emit(false);
      this.hideIcons("visible")
    }
  }

  //Add constellation to sky on click
  onSelectedConstellation(cst:Constellation){
    let nm = cst.name
    for (let i in this.constellations)
    {
      if (this.constellations[i].name == nm)
      {
        this.onSelected.emit(this.constellations[i])
      }
    }

    for (let i in this.locationConstellations)
    {
      if (this.locationConstellations[i].name == nm)
      {
        this.onSelected.emit(this.locationConstellations[i])
      }
    }
  }

  playSound() {
    // this.synth.playStars();
  }

  ngOnInit(): void {
  }

  
  toggleNavbar() {
    this.navbarOpened = !this.navbarOpened;
  }

  hideIcons(visibility:string) {
    //Disable Buttons
    let constellationButton = document.getElementsByClassName("starButton")
    constellationButton[0].setAttribute("disabled", "")

    //Close Menu Bar
    this.navbarOpened = false

    //Hide Icons
    let icons = [];
    icons.push(document.getElementsByClassName("outside"))
    icons.push(document.getElementsByClassName("drag-icon"))
    icons.push(document.getElementsByClassName("rotate-icon"))
    icons.push(document.getElementsByClassName("delete-icon"))
    icons.push(document.getElementsByClassName("resize-grip"))
    icons.push(document.getElementsByClassName("constellation-name"))
    icons.push(document.getElementsByClassName("custom-range  my-2"))

    if (icons[0] != null) {
      for (var i = 0; i < icons.length; i++) {
        for (var j = 0; j < icons[i].length; j++) {
          if (i == 0) {
            var str = icons[i][j].getAttribute("style")
            if ( str == null) {
              str = ""
            }
            if (visibility == "hidden")
            {
              icons[i][j].setAttribute("style", str + "border: solid 2px transparent;")
            }
            else {
              icons[i][j].setAttribute("style", str + "border: dotted #ccc 2px;")
            }
          }
          else {
            var str = icons[i][j].getAttribute("style")
            if ( str == null) {
              str = ""
            }
            icons[i][j].setAttribute("style", str + "visibility: "+visibility+ ";")
          }
        }
      }
    }
  }

}


