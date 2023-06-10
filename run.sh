#!/bin/bash
export MONGO_URL=mongodb://admin:admin@localhost:27017/be-a-robin
export ROOT_URL=http://localhost:9559
meteor run -p 9559 --inspect=9232 --settings settings.json
