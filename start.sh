#!/bin/bash

function get_property_from_env_file {
    grep "${1}" .env|cut -d'=' -f2
}

node server.js > logs/dicerollerserver.txt 2>&1 &
http-server -c-1 dist/nomads-dice-roller > logs/diceroller.txt 2>&1 &
lt --port 5500 --subdomain $(get_property_from_env_file 'LOCAL_TUNNEL_API_SUBDOMAIN_NAME') > logs/localtunnel-api.txt 2>&1 &
lt --port 8080 --subdomain $(get_property_from_env_file 'LOCAL_TUNNEL_SUBDOMAIN_NAME') > logs/localtunnel.txt 2>&1 &