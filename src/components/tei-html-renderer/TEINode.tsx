import { Fragment } from "react";
import { tagTranslate } from "./tagTranslator";

function TEINode(props: any) {
    // Si on est sur une feuille, c'est-à-dire uniquement du texte à afficher
    if (props.item.text || props.item.text === "") {
        return <Fragment>
            {props.item.text}
        </Fragment>
    }
    // Sinon, on fait un appel récursif sur tous les noeuds enfants
    return <Fragment>
        {tagTranslate(props.item.tag, props.item, props.setNote)}
    </Fragment>
}

export default TEINode;