import { Star } from "./star.model";
import { Connection } from "./connection.model";

export interface Constellation {
    height: number;
    width: number;
    name: string;
    stars: Star[];
    connections: Connection[];
    leftBound: number;
    constellationID:number;
    // TODO added: all data surrounding visiblity
}