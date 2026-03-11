import { Route } from "react-router-dom";
import Livraisons from "./Livraisons";
import Livraison from "./Livraison";
import Article from "./Article";

export const routes = [
    <Route path='/projects/mercure-galant/livraisons' element={<Livraisons />} />,
    <Route path='/projects/mercure-galant/livraisons/:livraison' element={<Livraison />} />,
    <Route path='/projects/mercure-galant/articles/:article' element={<Article />} />,
]