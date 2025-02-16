#!/usr/bin/env bash
set -e

regular="\e[0m"

bold="\e[1m"
green="\e[92m"
blue="\e[34m"

install=false
seed=false

announce() {
  if [[ $(uname) == "Linux" ]]; then
    echo -e "\n${bold}${blue}$1${regular}"
  else
    echo -e "\n${1}"
  fi
}

if [ ${#} -eq 0 ]
  then announce "No command supplied"
  help
  exit;
fi

cd "$(dirname "$0")"

ROOT=$PWD
CMD_ARG=${2:-essentials}

cd-types() {
  cd "${ROOT}/types"
}

cd-shared() {
  cd "${ROOT}/shared"
}

cd-api() {
  cd "${ROOT}/backend"
}

cd-demo() {
  cd "${ROOT}/frontend"
}

update() {
  announce "updating"
  yarn install
}

reset() {
  announce "resetting submodules"
  git submodule update --init
  install
}

#runMigrations() {
#  cd-api
#  announce "running migrations"
#  npm run migration:run
#  announce "running migrations finished"
#}

install() {
  announce "installing"  
  yarn install

  announce "installing types"
  yarn run build:types

  announce "installing shared"
  yarn run build:shared

  announce "installing frontend"
  cd-demo
  npm i

  announce "building shared"
  cd-api
  npm i
}

build() {
  announce "building"  
  yarn install

  announce "building types"
  yarn run build:types

  announce "building shared"
  yarn run build:shared

  announce "building frontend"
  cd-demo
  npm run build

  announce "building shared"
  cd-api
  npm run build
}

start() {
  announce "checking docker environment"
  cd "${ROOT}"
  docker compose up -d

  announce "docker environment ready"

  #runMigrations

  announce "starting types"
  cd-types
  yarn run start &

  announce "starting shared"
  cd-shared
  npm run start &

  announce "starting api"
  cd-api
  npm run start:debug &

  announce "starting demo project"
  
  cd-demo
  yarn run start &

  wait
}

case ${1} in
  "start")
    start
    ;;
  "build")
    build
    ;;
  "reset")
    reset
    ;;    
  "install")
    install
    ;;
  "update")
    update
    ;;    
esac
