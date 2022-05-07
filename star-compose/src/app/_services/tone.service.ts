import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import * as Tone from 'tone';
import { PolySynth } from 'tone';
import { Listener } from 'tone/build/esm/core/context/Listener';
import { Monophonic } from 'tone/build/esm/instrument/Monophonic';
import { Connection } from '../_models/connection.model';
import { Constellation } from '../_models/constellation.model';
import { Star } from '../_models/star.model';

@Injectable({
    providedIn: 'root'
  })
export class SynthService {
  bpm: number;
  noteSet: string[];
  noteSetB: string[];
  timeOfDay: number;
  pauseTime: number;
  screenWidth: number;
  bassMajorCollection = ['C2', 'F2', 'G2', 'A3', 'C3'];
  melodyMajorCollection = ['C4', 'D4', 'E4', 'F4', 'G4', 'A5', 'B5', 'C5'];

  bassMinorCollection = ['A2', 'D3', 'E3', 'F3', 'A3'];
  melodyMinorCollection = ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'];

  //reverb and effects
  verb = new Tone.Reverb(9).toDestination();
  //
  lim = new Tone.Limiter(-1).toDestination;
  // This assumes a constellation object with valid grid data.
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator : {
      volume: -21,
      count: 2,
      spread: 20,
      type : "fattriangle2"
    }
  }).toDestination();
  
  // bass synth for lines
  bass = new Tone.PolySynth(Tone.Synth, { 
      oscillator : {
        type : "sine3",
        volume: -19
    }
  }).toDestination();

  
  constructor() {
    this.bpm = 0
    this.pauseTime = 0;
    this.noteSet = [];
    this.noteSetB=[];
    this.screenWidth = window.innerWidth;
    this.synth.connect(this.verb);
    this.bass.connect(this.verb);
    const d = new Date();
    this.timeOfDay = d.getHours() + 1;

    if (this.timeOfDay < 2) {
      const dist = new Tone.Distortion(0.5).toDestination();
      const dist1 = new Tone.Distortion(0.2).toDestination();
      this.synth.connect(dist);
      this.bass.connect(dist1);
      this.noteSet = this.melodyMinorCollection;
      this.noteSetB = this.bassMinorCollection;
    }
    else if (this.timeOfDay < 10) {
      //Do nothing. It is calm here.
      this.noteSet = this.melodyMajorCollection;
      this.noteSetB = this.bassMajorCollection;

    }
    else if (this.timeOfDay < 19) {
      const ping = new Tone.PingPongDelay("0.4s", 0.52).toDestination();

      this.synth.connect(ping);
      this.noteSet = this.melodyMajorCollection;
      this.noteSetB = this.bassMajorCollection;

    }
    else if (this.timeOfDay < 23) {
      const phaser = new Tone.Phaser({
        frequency: 10,
        octaves: 2,
        baseFrequency: 700
      }).toDestination();

      this.bass.connect(phaser);
      this.noteSet = this.melodyMinorCollection;
      this.noteSetB = this.bassMinorCollection;
    }
    else {
      const dist = new Tone.Distortion(0.5).toDestination();
      const dist1 = new Tone.Distortion(0.2).toDestination();
      this.synth.connect(dist);
      this.bass.connect(dist1);
      this.noteSet = this.melodyMinorCollection;
      this.noteSetB = this.bassMinorCollection;
    }
  }
  //Reference for snippet -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random 
  getRandomInt(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

// build the melody based on the star data (currently just x data)
  playStars(constellation: {stars:Star[], connections:Connection[]}):void {
      Tone.Transport.stop();
      this.setTempo(60, this.screenWidth, 50);
      Tone.Transport.bpm.value = this.bpm;
      

      
      console.log("playing star:", constellation);
      let connections = constellation.connections;
      let playData2 = [];
      // This builds play times based on the line connections
      for (let line of connections) {
          let p1 = line.x1;
          let p2 = line.x2;
          if (p1 > p2){
            p1 = line.x2;
            p2 = line.x1;
          }
          let duration = Math.ceil((p2 - p1)/4);
          let pTime1 = Math.floor((p1-5)/4);
          let pBeat1 = (p1-5) % 4;
          
          playData2.push({'time': pTime1 + ':' + pBeat1, 'note': this.noteSetB[this.getRandomInt(0, 5)], 'duration': duration +'m', 'velocity': 0.6});
      }
    const bassLine = new Tone.Part(((time: any, value: { note: any; velocity: any; duration: any; }) => {
      // the value is an object which contains both the note and the velocity
      this.bass.triggerAttackRelease(value.note, value.duration, time, value.velocity);
      }), playData2).start(0);
      let stars = constellation.stars;
      let playData = [];
      // This builds play times based on the star dat of the constellation
      for (let star of stars) {
          let pTime = Math.floor(star.getX()/4);
          let pBeat = star.getX() % 4;
          playData.push({'time': pTime + ':' + pBeat, note: this.noteSet[this.getRandomInt(0, 8)], duration: '16n', 'velocity': 0.5});
      }
      const melody = new Tone.Part(((time: any, value: { note: any; velocity: any; }) => {
        // the value is an object which contains both the note and the velocity
        this.synth.triggerAttackRelease(value.note, "16n", time, value.velocity);
      }), playData).start(0);
      
      Tone.Transport.start();
      Tone.context.resume();
  }
  // function for changing tempo
  setTempo(time:number, screenSize: number, divsionSize: number):void {
      this.bpm = (screenSize) * (60/time)
  }

  pause():void {
    this.pauseTime = Tone.now();
    Tone.Transport.pause();
  }

  play():void {
    Tone.Transport.start(this.pauseTime);
  }

  stop():void {
    Tone.Transport.stop();
  }

}