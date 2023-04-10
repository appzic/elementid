#!/bin/bash

version=$(cat package.json | jq -r '.version')

npm run build &&\
npm pack &&\

if [ "$1" = "astro" ]; then 
    echo "Hello, astro!"
    cd examples/astro &&\
    npm uninstall elementid &&\
    npm i -D ../../elementid-$version.tgz &&\
    npm i &&\
    npm run build &&\
    npm run dev
elif [ "$1" = "vue" ]; then 
  echo "c"
else
  echo "Invalid argument"
fi


