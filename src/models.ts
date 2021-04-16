export interface Game {
    id: string,
    ruleset: RuleSet,
    timeout: number
}

export interface RuleSet {
    name: string,
    version: string
}

export class Coordinate {
    x: number;
    y: number;

    constructor(x: number, y:number) {
        this.x = x
        this.y = y
    }
}

export interface BattleSnake {
    id: string,
    name: string,
    health: number,
    body: Array<Coordinate>,
    latency: string,
    head: Coordinate,
    length: number,
    shout: string,
    squad: string
}

export interface Board {
    height: number,
    width: number,
    food: Array<Coordinate>
    hazards: Array<Coordinate>
    snakes: Array<BattleSnake>
}

export class Move {
    move: string;
    shout?: string;

    constructor(move: string, shout?: string) {
        this.move = move
        this.shout = shout
    }
}

export interface GameData {
    game: Game,
    turn: number,
    board: Board,
    you: BattleSnake
}

//Weightless since all edges are 1 apart
export class Edge {
    source: Coordinate;
    destination: Coordinate;

    constructor (source: Coordinate, destination: Coordinate) {
        this.source = source
        this.destination = destination
    }
}

export class Graph {    
    listOfEdges = new Map<Coordinate, Coordinate[]>();
    
    public addEdge(edge: Edge) {
        this.listOfEdges.get(edge.source).push(edge.destination)
    }
}



