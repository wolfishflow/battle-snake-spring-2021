export interface Game {
    id: string,
    ruleset: RuleSet,
    timeout: number
}

export interface RuleSet {
    name: string,
    version: string
}

export interface Coordinate {
    x: number,
    y: number
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

export interface Move {
    move: string,
    shout?: string,
}

export interface GameData {
    game: Game,
    turn: number,
    board: Board,
    you: BattleSnake
}
