
# Django Angular Webpack Starter

Starter pack for building an Angular 4 web application with Django backend.
Includes Material Design library.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

npm

python3

pip

### Installing

Clone the repository from git

```
git clone git@gitlab.com:codewiseio/Django-Angular-Webpack-Starter.git
```


#### Install Back End

Create and enter python virtual environment.

```
virtualenv -p python3 venv
source ./venv/bin/activate
```

Install the python requirements

```
pip install -r requirements.txt
```

Install database migrations

```
python manage.py migrate
```

Create the super user. 

```
python manage.py createsuperuser
```


#### Install Front End

Install the angular/material dependancies

```
cd angular/app
npm install
```


### Development 

Development takes place using two tools. The Django development server to view the application in the browser, and webpack which watches for changes to the the angular application and rebuilds the angular application as necessary.

```
cd ../..
python manage.py runserver
```

Start the Django development server and open in your browser at 
http://localhost:8000. 

#### Webpack

```
cd angular/app
npm run dev
```

This will watch the for changes in files in the angular app folder and rebuild the angular application as necessary. You will need to refresh your browser to view the changes.



#### Lite Server

```
cd angular/app
npm start
```

This will start the angular server which automatically refreshes the browser on changes.

*NOT CURRENTLY SUPPORTED*

Angular does not currently support multiple CSRF tokens. For this reason it is not recommended
to run a seperate development server for the Django and Angular applications. This may change
in the future.




## Creating a new component

ng g component my-new-component

## Creating a new django application




## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```


## Deployment


### Deploying to Fresh Ubuntu 17.10


Install all updates

```
sudo apt-get update && sudo apt-get upgrade -y
```

Install pre-requisites

```
sudo apt-get install npm python3 -y
```

Clone the repository
```
```




## Additional Information

### Adding Models to the Admin Section

```
from django.contrib import admin
from django.db import models

@admin.register(MyModel)
class MyModel(models.Model):
    ...
```

### Creating Data Migrations in Django

python manage.py makemigrations app --empty


## Resources

### Django Sites, finding absolute url

https://docs.djangoproject.com/en/1.11/ref/contrib/sites/

### Django Authentication - JWT

https://www.octobot.io/blog/2016-11-11-json-web-token-jwt-authentication-in-a-djangoangularjs-web-app/

### Django Testing

https://docs.djangoproject.com/en/1.11/topics/testing/overview/
https://docs.djangoproject.com/en/1.11/topics/testing/overview/#running-tests
https://docs.djangoproject.com/en/1.11/topics/testing/advanced/#testing-reusable-applications


## Authors

* Jeffrey Hallock, CodeWise Software

## License

This project is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Acknowledgments

Thanks to the Angular and Material and Webpack teams!