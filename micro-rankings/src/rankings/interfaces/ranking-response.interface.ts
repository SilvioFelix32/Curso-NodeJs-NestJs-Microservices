export interface RankingResponse {
    player?: string
    position?: number
    punctuation?: number
    matchesHistory?: History
}

export interface History {
    wins?: number
    defeats?: number
}
