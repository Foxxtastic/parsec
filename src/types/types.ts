export type MyDocument = {
    id: number,
    fileName: string,
    upLoaded: string
}

export type Sentence = {
    approved: boolean,
    text: string,
    addAsKeyword: boolean
}

export type TXTFile = {
    file_name: string,
    sentences: string[]
}

export type KeywordInDocument = {
    start: number,
    end: number,
    phrase: string
}

enum CommonWordType {
    words = "words",
    nouns = "nouns",
    verbs = "verbs"
}

type CommonWordTypeItem = {
    text: string,
    count: number
}

export type CommonWord = {
    [key in CommonWordType]: CommonWordTypeItem[]
}