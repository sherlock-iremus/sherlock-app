import { OntologyProperty } from './Ontology'

export enum Languages {
  NONE = '',
  DE = 'de',
  EL = 'el',
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  PT = 'pt',
  RU = 'ru',
  ZH = 'zh'
}

export enum XSDTypes {
  anyURI,
  base64Binary,
  boolean,
  date,
  dateTime,
  decimal,
  double,
  duration,
  float,
  hexBinary,
  gDay,
  gMonth,
  gMonthDay,
  gYear,
  gYearMonth,
  NOTATION,
  QName,
  string,
  time
}

export class Resource {
  private _pog: Map<OntologyProperty, Array<OG | undefined>>
  private _uri: string

  constructor(uri: string = '') {
    this._uri = uri
    this._pog = new Map()
  }

  getValues(p: OntologyProperty): Array<OG | undefined> | undefined {
    return this._pog.get(p)
  }

  addPOG(p: OntologyProperty, og: OG | undefined) {
    if (this._pog.has(p)) {
      this._pog.get(p)?.push(og)
    }
    else {
      this._pog.set(p, [og])
    }
  }

  get uri(): string { return this._uri }
  get pog(): Map<OntologyProperty, Array<OG | undefined>> { return this._pog }
}

export class Literal {
  private _lang: Languages
  private _value: any
  private _type: XSDTypes

  constructor(lang: Languages, type: XSDTypes, value: any) {
    this._lang = lang
    this._type = type
    this._value = value
  }

  get lang(): Languages { return this._lang }
  get type(): XSDTypes { return this._type }
  get value(): Languages { return this._value }

  public toString = (): string => `${this._value}@${this._lang}`
}

export class Graph {
  private _uri: string

  constructor(uri: string) {
    this._uri = uri
  }

  get uri() { return this._uri }
}

export class OG {
  private _literal: Literal | undefined
  private _resource: Resource | undefined
  private _graph: Graph | undefined

  constructor(l: Literal | undefined, r: Resource | undefined, g: Graph | undefined = undefined) {
    this._literal = l
    this._resource = r
    this._graph = g
  }

  get literal(): Literal | undefined { return this._literal }
  get resource(): Resource | undefined { return this._resource }
  get graph(): Graph | undefined { return this._graph }
}