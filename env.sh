#!/bin/bash

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment 
echo "window._env_ = { \
 PORT: \"$PORT\",\ 
 APP_ID: \"$APP_ID\", \
 APP_SECRET: \"$APP_SECRET\", \
 APP_NAME_IDM: \"$APP_NAME_IDM\", \
 ADMIN_ROLE_NAME: \"$ADMIN_ROLE_NAME\", \
 DEVICE_TYPE: \"$DEVICE_TYPE\", \
 MANAGEMENT_API_IP: \"$MANAGEMENT_API_IP\", \
 MANAGEMENT_API_PORT: \"$MANAGEMENT_API_PORT\", \
 KEYROCK_IP: \"$KEYROCK_IP\", \
 KEYROCK_PORT: \"$KEYROCK_PORT\", \
 ORION_IP: \"$ORION_IP\", \
 ORION_PORT: \"$ORION_PORT\", \
 STH_IP: \"$STH_IP\", \
 STH_PORT: \"$STH_PORT\", \
 FIWARE_SERVICE: \"$FIWARE_SERVICE\", \
 FIWARE_SERVICE_PATH: \"$FIWARE_SERVICE_PATH\" }  " >> ./env-config.js
 

