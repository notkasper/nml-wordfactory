# nml-wordfactory

# setup guide

# prerequisites

install node  
install npm

# install dependencies

run `npm i` in root of project  
cd into frontend and `npm i`  
cd into backend and `npm i`

# setup environment variables

create a file called '.env' in the root of the project (.env files should not be tracked using git, as this poses a security vulnerability)  
add this to the file:

MONGO_URI=  
NODE_ENV=development

# connect to database

either do a cloud hosted or local hosted versiom

## cloud

make an account on https://www.mongodb.com/cloud/atlas  
create a free tier cluster  
copy the connection string, and replace dbname and password with the proper credentials  
put connection string after `MONGO_URI=` in the .env file  
done

## local

follow this guide as it explains it better than I can :)  
https://medium.com/@LondonAppBrewery/how-to-download-install-mongodb-on-windows-4ee4b3493514  
boils down to:  
install local mongodb engine  
create database/cluster  
copy connection string  
put into .env (same as with a cloud version)

## test if it runs

run `npm run dev` in the root  
if it does not work, contact repo owner or a collaborator
