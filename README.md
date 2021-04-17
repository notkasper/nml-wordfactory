# nml-wordfactory

# setup guide

# prerequisites

1. install node
2. install npm

# install dependencies

1. run `npm i` in root of project
2. cd into frontend and `npm i`
3. cd into backend and `npm i`

# create database

1. install postgresql (https://www.postgresql.org/) (During installation, you can check 'install pgadmin' to skip the next step)
2. install pgadmin (https://www.pgadmin.org/)
3. start pgadmin
4. in pgadmin, create a server called wordfactory, and set the host to 'localhost'
5. create a new user by right clicking 'Login/Group roles' under the created server. Use 'wordfactory' as the username and password, and check the 'can login' option.
6. right click 'Databases', and create a new database called 'wordfactory', and set the user to the one you just created.

# setup environment variables

create a file called '.env' in the root of the project (.env files should not be tracked using git, as this poses a security vulnerability)  
add this to the file, and fill it in:

DB_USER=  
DB_NAME=  
DB_PASSWORD=  
DB_HOST= // default: localhost  
DB_PORT= // default: 5432  
NODE_ENV= // development/production  
SERVER_PORT=  
JWT_SECRET= // for development, anything will do

# test if it runs

run `npm run dev` in the root  
if it does not work, contact repo owner or a collaborator

# how to deploy

run `npm run build` in the root folder, this will:

1. Create a fresh build for the frontend
2. move the new build into the backend folder so it may be served by the API

after this you can test by running `npm run prod` in the root, and visiting the url (if testing locally; localhost:3000)
