yarn unlink sherlock-rdf
cd ~/repositories/sherlock-rdf
yarn unlink
yarn run build
yarn link
yarn install --force

yarn unlink sherlock-sparql-queries
cd ~/repositories/sherlock-sparql-queries
yarn unlink
yarn run build
yarn link
yarn install --force

cd ~/repositories/sherlock-app
yarn link sherlock-rdf
yarn link sherlock-sparql-queries