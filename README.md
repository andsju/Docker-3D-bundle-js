# Docker-3D-budle-js


Build a on file three.js dependecy  to display `.glb` file.


`docker-compose build --no-cache`
`docker-compose up`

Copy bulit file from container to local ./bundle.js

`docker cp three_frontend:/usr/share/nginx/html/bundle.js ./bundle.js`
