import { 
  Component, 
  OnInit, 
  Attribute, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChildren, 
  QueryList,
  ElementRef
} from '@angular/core';
import { ConstellationComponent } from '../constellation/constellation.component';
// import { EventEmitter } from 'stream';
import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Connection } from '../_models/connection.model';
import { Constellation } from '../_models/constellation.model';
import { Star } from '../_models/star.model';
import {SynthService} from '../_services/tone.service';
import data from './constellations.json';

@Component({
  selector: 'app-sky',
  templateUrl: './sky.component.html',
  styleUrls: ['./sky.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class SkyComponent implements OnInit {

  @ViewChildren(ConstellationComponent) consts!: QueryList<ConstellationComponent>;
  @Output() getScreenCoords = new EventEmitter<boolean>();

  constructor(private synth: SynthService) { this.width = window.innerWidth; }


  // Constellations in menu
  constellations:Constellation[] = [];
  width:number;

  // Constellations in sky
  draggableConstellations:Constellation[] = [];
  allConstellations:Constellation[] = [];

  currStar:Star[] = [];
  currConnection:Connection[] = [];
  boolChange = 0;
  myLat = -100000;
  currID = 0;

  //List of all constellations
  public constellationList:{height:number, width:number, month:number, nLat:number, sLat:number, quadrant:string, name:string, stars:any, connections:any}[] = data;

  //Get User Location
  callApi(Longitude: number, Latitude: number){
    const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${Longitude}&lat=${Latitude}`
  }

  //Add constellation to sky on click
  onSelectedConstellation(constellation:Constellation)
  {    
    let newConst: Constellation = {
      height: constellation.height,
      width: constellation.width,
      name: constellation.name,
      stars: constellation.stars.map(x => Object.assign({}, x)),
      connections: constellation.connections.map(x => Object.assign({}, x)),
      leftBound: 0,
      constellationID: this.currID
    }

    this.draggableConstellations.push(newConst)
   this.currID++;
   this.boolChange = 1 
  }

  changeStarPosition()
  {
    let height =  window.innerHeight - (0.05 * window.innerHeight);
    let width =  window.innerWidth - (0.2 * window.innerWidth);
    
    let randHeight = (Math.floor(Math.random() * ( (height -299)-(0.05 * window.innerHeight) ) +(0.05 * window.innerHeight)).toString() + "px");
    let randWidth = (Math.floor(Math.random() * (width - 299))).toString() + "px";
    
    if (height < 300)
    {
      randHeight = "0px";
    }
    if (width < 300)
    {
      randWidth = "0px";
    }
    let elem = document.getElementsByClassName("stars")
    if (elem != null)
    {
        if (elem.length > 0)
        {
        let str = "position: absolute; top:" +randHeight+ "; left:" +randWidth+ ";"
        elem[this.draggableConstellations.length - 1].setAttribute("style", str)
        }
    }
    this.boolChange = 0;
  }

  //Attempts to get user location; Gets filtered constellations if location is permitted, otherwise gets all constellations
  getLocation()
  {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("i'm tracking you!");
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.callApi(longitude, latitude);
        this.myLat = latitude
        this.getConstellations()
        if (this.constellations.length < 1)
        {
          this.constellations = this.allConstellations
        }
    },
    (error) => {
      if (error.code == error.PERMISSION_DENIED)
        console.log("You denied support for geolocation :-(")
        this.getConstellations()
        this.constellations = this.allConstellations
    });
  }

  //Gets constellations to show on the menu
  getConstellations()
  {
    //Get current date
    let myDate = new Date();
    let month = myDate.getMonth() + 1;

    //Get Constellation Data
    for (let item in this.constellationList)
    { 
      for (let star in this.constellationList[item].stars)
      {
        let temp1 = new Star(this.constellationList[item].stars[star][0],this.constellationList[item].stars[star][1])
        this.currStar.push(temp1)
      }
      for (let connection in this.constellationList[item].connections)
      {
        let temp1 = new Connection(this.constellationList[item].connections[connection][0],this.constellationList[item].connections[connection][1],this.constellationList[item].connections[connection][2],this.constellationList[item].connections[connection][3])
        this.currConnection.push(temp1)
      }
      let temp: Constellation = {
        height: this.constellationList[item].height,
        width: this.constellationList[item].width,
        name: this.constellationList[item].name,
        stars: this.currStar,
        connections: this.currConnection,
        leftBound: 0,
        constellationID: -1
      }
      if (this.constellationList[item].month == month && this.constellationList[item].nLat > this.myLat && this.constellationList[item].sLat < this.myLat)
      {
        this.constellations.push(temp)
      }

      this.currStar = []
      this.currConnection = []
      this.allConstellations.push(temp)
    }
  }

  //Get time of day to choose background to display
  getTime() {
    const date = new Date();
    let hour = date.getHours();

    let night = document.getElementsByClassName("night")
    let day = document.getElementsByClassName("day")

    let body = document.getElementsByTagName("body")


    if (0 <= hour && hour <= 6)
    {
      night[0].setAttribute("style", "visibility:visible;")
    }
    else if (6 < hour && hour <= 12)
    {
      day[0].setAttribute("style", "visibility:visible;")
      body[0].setAttribute("style", "background-image: linear-gradient(#9cb8ea, #5f8fe3);")
    }
    else if (12 < hour && hour <= 18)
    {
      day[0].setAttribute("style", "visibility:visible;")
      body[0].setAttribute("style", "background-image: linear-gradient(#2F4090, #9284D1);")
    }
    else if (18 < hour && hour < 24)
    {
      night[0].setAttribute("style", "visibility:visible;")
      
    }
  }

  renderAudio($event: boolean) {
    let constData: {stars: Star[], connections: Connection[]} = {stars: [], connections: []}
    // console.log("sky got button press");
    // this.consts.forEach((element, index) => console.log(element.getScreenCoord()));
    this.consts.forEach((element, index) => {
      // console.log(element.getScreenCoord().stars);
      constData.stars.push(...element.getScreenCoord().stars);
      constData.connections.push(...element.getScreenCoord().connections);
    });
    console.log(constData);
    
    this.synth.playStars(constData);
  }

  ngOnInit(): void {
    this.getLocation()
    this.getTime()
  }

  ngAfterViewChecked(): void {
    if (this.boolChange == 1)
    {
      this.changeStarPosition()
    }
  }
}
