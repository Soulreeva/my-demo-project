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

cdtypes() {
  cd "${ROOT}/types"
}

cdapi() {
  cd "${ROOT}/backend"
}

cddemo() {
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
#  cdapi
#  announce "running migrations"
#  npm run migration:run
#  announce "running migrations finished"
#}

install() {
  announce "installing"  
  yarn install

  announce "building shared types"
  yarn run build:types

  announce "building client shared library"
  yarn run build:shared
}

start() {
  announce "checking docker environment"
  cd "${ROOT}"
  docker compose up -d

  announce "docker environment ready"

  #runMigrations

  announce "starting types"
  cdtypes
  yarn run start &

  announce "starting client shared"
  cdclient-shared
  yarn run start &

  announce "starting api"
  cdapi
  yarn run start:debug &

  announce "starting demo project"
  
  cddemo
  yarn run start &

  wait
}

case ${1} in
  "start")
    start
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
