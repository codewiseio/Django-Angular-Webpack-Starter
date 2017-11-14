
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



```
cd ../..
python manage.py runserver
```

Start the Django development server and open in your browser at 
http://localhost:8000. 

#### Webpack

```
cd angular/app
webpack --watch
```

This will watch the for changes in files in the angular app folder and rebuild
as necessary. 



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

Add additional notes about how to deploy this on a live system


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


### Todo

X Send Password Reset Emails DONE

X Perform Password Reset - Monday

X Perform Login - Tuesday

X Allow user to change email and password - Wednesday

X Material Icons from Local Host

AOT

i18n

Guards
-----


X Writing Django Tests - Thursday

.. Writing Angular Tests - Friday


X Move Django Authentication to a Reusable App

- Permissions

Publish Django Authentication Module - Wednesday



Move Angular Authentication to a Reusable App - Thursday/Friday

Publish Angular Authentication Module - Saturday Nov-18



Refactor Quickstart App - Monday November 20

Create Contacts Application - Nov 21 - Nov 24



Nov 27 - Dec 1 - Oikos TimeClock Application

Dec 4 - 8 Doxa Reboot 2.0

	- File Uploading

	- Profiles






-----

Create Contacts Application

Create Blog - Wednesday

Create


Create Oikos Application - C

Create 


## Resources

### Django Sites, finding absolute url

https://docs.djangoproject.com/en/1.11/ref/contrib/sites/

### Django Authentication - JWT

https://www.octobot.io/blog/2016-11-11-json-web-token-jwt-authentication-in-a-djangoangularjs-web-app/

### Django Testing

https://docs.djangoproject.com/en/1.11/topics/testing/overview/
https://docs.djangoproject.com/en/1.11/topics/testing/overview/#running-tests
https://docs.djangoproject.com/en/1.11/topics/testing/advanced/#testing-reusable-applications




## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* Jeffrey Hallock - [CodeWise.live](https://codewise.live)

## License

This project is licensed under the Artistic License 2.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Thanks to the Angular and Material and Webpack teams!