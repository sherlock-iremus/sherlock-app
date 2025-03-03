# pnpm unlink --global sherlock-rdf
# pnpm unlink --global sherlock-sparql-queries
# pnpm unlink --global tei-html-renderer

# cd ~/repositories/sherlock-rdf
# pnpm link --global

# cd ~/repositories/sherlock-sparql-queries
# pnpm link --global

# cd ~/repositories/tei-html-renderer
# pnpm run build
# pnpm link --global

# cd ~/repositories/sherlock-app
# pnpm link --global sherlock-rdf
# pnpm link --global sherlock-sparql-queries
# pnpm link --global tei-html-renderer


yarn unlink sherlock-rdf
cd ~/repositories/sherlock-rdf
yarn unlink
yarn run build
yarn link

yarn unlink sherlock-sparql-queries
cd ~/repositories/sherlock-sparql-queries
yarn unlink
yarn run build
yarn link

yarn unlink tei-html-renderer
cd ~/repositories/tei-html-renderer
yarn unlink
yarn run build
yarn link

cd ~/repositories/sherlock-app
yarn link sherlock-rdf
yarn link sherlock-sparql-queries
yarn link tei-html-renderer