
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
Give the example
```

Create and enter python virtual environment.

```
virtualenv -p python3 venv
source ./venv/bin/activate
```

Install the python requirements

```
pip install -r requirements.txt
```

Install the angular/material dependancies

```
cd angular/app
npm install
```

Start the Django development server and open in your browser 
at http://localhost:8000

```
cd ../..
python manage.py runserver
```

You now have your Angular/Django application running. 


Building the Angular App

```
cd angular/app
webpack --watch
```



Start lite server

```
cd angular/app
npm start
```


Development build

```
npm run build
```

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