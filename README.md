API using firebase, and casbin
1. create firebase project, enable one or more authentication methods.
2. replace content of ```files/firebase-admin.json``` with your firebase admin file.
3. fill variables on ```.env```.
4. run ```yarn install```.
5. to start the server, run ```node init-server.js```.

To use casbin, you should have super admin, who has access to all endpoints, to do so, you should have atleast one user (```model/User.js```), then add it to casbin.
Please refer to file ```file util/casbin.js``` on how to manage user/role/group of casbin.
