pnpm unlink --global sherlock-rdf
pnpm unlink --global sherlock-sparql-queries
cd ~/repositories/sherlock-rdf
pnpm link --global
cd ~/repositories/sherlock-sparql-queries
pnpm link --global
cd ~/repositories/sherlock-app
pnpm link --global sherlock-rdf
pnpm link --global sherlock-sparql-queries