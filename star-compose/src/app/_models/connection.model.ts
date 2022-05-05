import { Star } from "./star.model";

export class Connection {
    public x1:number;
    public y1:number;
    public x2:number;
    public y2:number;

    constructor(x1:number, y1:number, x2:number, y2:number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    // constructor(star1: Star, star2: Star) {
    //     this.x1 = star1.x;
    //     this.y1 = star1.y;
    //     this.x2 = star2.x;
    //     this.y2 = star2.y;
    // }

}