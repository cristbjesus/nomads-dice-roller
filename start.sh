#!/bin/bash
node server.js > logs/nodejs-logs.txt 2>&1 &
http-server -c-1 dist/nomads-dice-roller > logs/angular-logs.txt 2>&1 &
lt --port 5500 --subdomain <YOUR_LOCAL_TUNNEL_API_SUBDOMAIN_NAME> > logs/localtunnel-api-logs.txt 2>&1 &
lt --port 8080 --subdomain <YOUR_LOCAL_TUNNEL_SUBDOMAIN_NAME> > logs/localtunnel-logs.txt 2>&1 &