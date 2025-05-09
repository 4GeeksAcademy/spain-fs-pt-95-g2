WebApp boilerplate with React JS and Flask API
Build web applications using React.js for the front end and python/flask for your backend API.

Documentation can be found here: https://4geeks.com/docs/start/react-flask-template
Here is a video on how to use this template
Integrated with Pipenv for package managing.
Fast deployment to Render in just a few steps here.
Use of .env file.
SQLAlchemy integration for database abstraction.
1) Installation:
If you use Github Codespaces (recommended) or Gitpod this template will already come with Python, Node and the Posgres Database installed. If you are working locally make sure to install Python 3.10, Node

It is recomended to install the backend first, make sure you have Python 3.10, Pipenv and a database engine (Posgress recomended)

Install the python packages: $ pipenv install
Create a .env file based on the .env.example: $ cp .env.example .env
Install your database engine and create your database, depending on your database you have to create a DATABASE_URL variable with one of the possible values, make sure you replace the valudes with your database information:
Engine	DATABASE_URL
SQLite	sqlite:////test.db
MySQL	mysql://username:password@localhost:port/example
Postgress	postgres://username:password@localhost:5432/example
Migrate the migrations: $ pipenv run migrate (skip if you have not made changes to the models on the ./src/api/models.py)
Run the migrations: $ pipenv run upgrade
Run the application: $ pipenv run start
Note: Codespaces users can connect to psql by typing: psql -h localhost -U gitpod example

Undo a migration
You are also able to undo a migration by running

$ pipenv run downgrade
Backend Populate Table Users
To insert test users in the database execute the following command:

$ flask insert-test-users 5
And you will see the following message:

  Creating test users
  test_user1@test.com created.
  test_user2@test.com created.
  test_user3@test.com created.
  test_user4@test.com created.
  test_user5@test.com created.
  Users created successfully!
Important note for the database and the data inside it
Every Github codespace environment will have its own database, so if you're working with more people eveyone will have a different database and different records inside it. This data will be lost, so don't spend too much time manually creating records for testing, instead, you can automate adding records to your database by editing commands.py file inside /src/api folder. Edit line 32 function insert_test_data to insert the data according to your model (use the function insert_test_users above as an example). Then, all you need to do is run pipenv run insert-test-data.

Front-End Manual Installation:
Make sure you are using node version 20 and that you have already successfully installed and runned the backend.
Install the packages: $ npm install
Start coding! start the webpack dev server $ npm run start
Publish your website!
This boilerplate it's 100% read to deploy with Render.com and Heroku in a matter of minutes. Please read the official documentation about it.

Contributors
This template was built as part of the 4Geeks Academy Coding Bootcamp by Alejandro Sanchez and many other contributors. Find out more about our Full Stack Developer Course, and Data Science Bootcamp.

You can find other templates and resources like this at the school github page.