# myProjects

Following are the deploying steps to run the nodejs project

1. Create data directory to store mongodb data
    $ sudo mkdir /data/db

2. Assign dbpath 
    $ sudo mongod --dbpath /data/db

3. Then start mongod process again.
    $ sudo mongod -f /etc/mongod --fork 

4. Now start mongo shell
    $ sudo mongo

5. Create database upstox.
    > use upstox

6. Create collection customers.
    > db.createCollection('customers')

7. Copy the git project link and clone the project
    $ sudo git clone link-to-project

8. Start that project with express and do the changes according to availabe app.js and package.json file.
    $ sudo express project
    $ cd project
    $ sudo npm install

9. Finally start npm project
    $ sudo npm start

10. Check with browser
    http://localhost:3000
 
