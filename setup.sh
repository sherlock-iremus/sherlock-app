pnpm unlink --global sherlock-rdf
pnpm unlink --global sherlock-sparql-queries
cd ../sherlock-rdf
pnpm link --global
cd ../sherlock-sparql-queries
pnpm link --global
cd ../sherlock-app
pnpm link --global sherlock-rdf
pnpm link --global sherlock-sparql-queries