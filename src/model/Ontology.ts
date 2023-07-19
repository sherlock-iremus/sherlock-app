import { Languages } from "../constants/RDF"

export abstract class OntologyStuff {
  static label = ''

  _comment: Map<Languages, string>
  _intCodeForSorting: number
  _label: Map<Languages, string>
  _name: string
  _ontology: Ontology
  _uri: string

  constructor(comment: Map<Languages, string>, intCodeForSorting: number, label: Map<Languages, string>, name: string, ontology: Ontology, uri: string) {
    this._comment = comment
    this._intCodeForSorting = intCodeForSorting
    this._label = label
    this._name = name
    this._ontology = ontology
    this._uri = uri
  }

  getComment(l: Languages) { return this._comment.get(l) }
  getLabel(l: Languages) { return this._label.get(l) }
}

export class OntologyClass extends OntologyStuff {
  _subClassOf: Array<OntologyClass>

  constructor(comment: Map<Languages, string>, intCodeForSorting: number, label: Map<Languages, string>, name: string, ontology: Ontology, uri: string) {
    super(comment, intCodeForSorting, label, name, ontology, uri)

    this._subClassOf = new Array<OntologyClass>()
  }

  addSubClassOf(subClassOf: OntologyClass) { this._subClassOf.push(subClassOf) }
}

export class OntologyProperty extends OntologyStuff {
  _domain: OntologyClass
  _inverseOf: OntologyProperty
  _range: OntologyClass
  _subPropertyOf: Array<OntologyProperty>

  constructor(comment: Map<Languages, string>, intCodeForSorting: number, label: Map<Languages, string>, name: string, ontology: Ontology, uri: string) {
    super(comment, intCodeForSorting, label, name, ontology, uri)

    this._subPropertyOf = new Array<OntologyProperty>()
  }

  public set domain(domain: OntologyClass) { this._domain = domain }
  public set inverseOf(inverseOf: OntologyProperty) { this._inverseOf = inverseOf }
  public set range(range: OntologyClass) { this._range = range }
  addSubPropertyOf(subPropertyOf: OntologyProperty) { this._subPropertyOf.push(subPropertyOf) }
}

export class Ontology {
  _classesRegistry: Map<string, OntologyClass> = new Map<string, OntologyClass>()
  _propertiesRegistry: Map<string, OntologyProperty> = new Map<string, OntologyProperty>()

  _name: string
  _classes: Array<OntologyClass>
  _properties: Array<OntologyProperty>

  constructor(name: string) {
    this._name = name
    this._classes = []
    this._properties = []
  }

  addClass(c: OntologyClass) {
    this._classes.push(c)
    this._classes = this._classes.sort()
    this._classesRegistry.set(c._uri, c)
  }

  addProperty(p: OntologyProperty) {
    this._properties.push(p)
    this._properties = this._properties.sort()
    this._propertiesRegistry.set(p._uri, p)
  }

  get name() { return this._name }
  get classes() { return this._classes }
  get properties() { return this._properties }

  sortAll() {
    this._classes = this._classes.sort((a, b) => a._intCodeForSorting - b._intCodeForSorting)
    this._properties = this._properties.sort((a, b) => a._intCodeForSorting - b._intCodeForSorting)
  }
}
