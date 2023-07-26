import { Languages } from '../constants/RDF'
import { Resource } from './Resource'

export class Ontology {
  static void: Ontology = new Ontology('')

  private _classesRegistry: Map<string, OntologyClass> = new Map<string, OntologyClass>()
  private _name: string
  private _classes: Array<OntologyClass>
  private _properties: Array<OntologyProperty>
  private _propertiesRegistry: Map<string, OntologyProperty> = new Map<string, OntologyProperty>()

  constructor(name: string) {
    this._name = name
    this._classes = []
    this._properties = []
  }

  addClass(c: OntologyClass) {
    this._classes.push(c)
    this._classes = this._classes.sort()
    this._classesRegistry.set(c.uri, c)
  }

  addProperty(p: OntologyProperty) {
    this._properties.push(p)
    this._properties = this._properties.sort()
    this._propertiesRegistry.set(p.uri, p)
  }

  get name() { return this._name }
  get classes() { return this._classes }
  get properties() { return this._properties }

  sortAll() {
    this._classes = this._classes.sort((a, b) => a.intCodeForSorting - b.intCodeForSorting)
    this._properties = this._properties.sort((a, b) => a.intCodeForSorting - b.intCodeForSorting)
  }
}

export abstract class OntologyStuff extends Resource {
  static label = ''

  private _comment: Map<Languages, string>
  protected _intCodeForSorting: number
  private _label: Map<Languages, string>
  private _name: string
  private _ontology: Ontology

  constructor(uri: string, name: string, ontology: Ontology) {
    super(uri)

    this._comment = new Map<Languages, string>()
    this._intCodeForSorting = -1
    this._label = new Map<Languages, string>()
    this._name = name
    this._ontology = ontology
  }

  get comment(): Map<Languages, string> { return this._comment }
  set comment(comment: Map<Languages, string>) { this._comment = comment }
  get intCodeForSorting(): number { return this._intCodeForSorting }
  set intCodeForSorting(intCodeForSorting: number) { this._intCodeForSorting = intCodeForSorting }
  set label(label: Map<Languages, string>) { this._label = label }
  get name(): string { return this._name }
  get ontology(): Ontology { return this._ontology }
  getComment(l: Languages) { return this._comment.get(l) }
  getLabel(l: Languages) { return this._label.get(l) }
}

export class OntologyClass extends OntologyStuff {
  static void: OntologyClass = new OntologyClass('', '', Ontology.void)

  private _subClassOf: Array<OntologyClass>

  constructor(uri: string, name: string, ontology: Ontology) {
    super(uri, name, ontology)

    this._subClassOf = new Array<OntologyClass>()
  }

  addSubClassOf(subClassOf: OntologyClass) { this._subClassOf.push(subClassOf) }
}

export class OntologyProperty extends OntologyStuff {
  static void: OntologyProperty = new OntologyProperty('', '', Ontology.void)

  private _domain: OntologyClass = OntologyClass.void
  private _inverseOf: OntologyProperty = OntologyProperty.void
  private _range: OntologyClass = OntologyClass.void
  private _subPropertyOf: Array<OntologyProperty>

  constructor(uri: string, name: string, ontology: Ontology) {
    super(uri, name, ontology)

    this._subPropertyOf = new Array<OntologyProperty>()
  }

  get domain(): OntologyClass { return this._domain }
  set domain(domain: OntologyClass) { this._domain = domain }
  get inverseOf(): OntologyProperty { return this._inverseOf }
  set inverseOf(inverseOf: OntologyProperty) { this._inverseOf = inverseOf }
  get range(): OntologyClass { return this._range }
  set range(range: OntologyClass) { this._range = range }
  addSubPropertyOf(subPropertyOf: OntologyProperty) { this._subPropertyOf.push(subPropertyOf) }
}