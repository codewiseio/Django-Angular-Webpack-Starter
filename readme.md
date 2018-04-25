
# Django Angular Webpack Starter

Starter pack for building an Angular 4 web application with Django backend.
Includes Material Design library.

## Developer Guide

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* npm
* python3
* pip
* git
* virtualenv

### Project Setup

#### Clone the repository

Clone and enter the repository from git

```
git clone git@gitlab.com:codewiseio/Django-Angular-Webpack-Starter.git
cd Django-Angular-Webpack-Starter
```


#### Python/Django Setup

##### Create a virtual environment

```
virtualenv -p python3 venv
source ./venv/bin/activate
```

##### Install the python modules

```
pip install -r requirements.txt
```

##### Migrate database

```
python manage.py migrate
```

##### Create superuser account

```
python manage.py createsuperuser
```


#### Angular/Webpack Setup

##### InstallAngular, Webpack, and dependencies

```
cd angular/app
npm install
```


### Development 

Development takes place using two tools. The Django development server to view the application in the browser, and webpack which watches for changes to the the angular application and rebuilds the angular application as necessary.

#### Django Development Server

The Django development server starts a server on your local machine. Changes to the Python and Django code will cause the server to reload the application.

##### Start the server

```
python manage.py runserver
```

##### View in browser

```
http://localhost:8000
```


#### Webpack 

Watch for changes in the angular app and rebuild the bundle as necessary.
Refresh your browser to see changes.

```
cd angular/app
npm run dev
```

<!-- #### Lite Server

```
cd angular/app
npm start
```

This will start the angular server which automatically refreshes the browser on changes.

*NOT CURRENTLY SUPPORTED*

Angular does not currently support multiple CSRF tokens. For this reason it is not recommended
to run a seperate development server for the Django and Angular applications. This may change
in the future.
 -->



### Creating a new component

ng g component my-new-component

## Creating a new django application



## Deployment

This guide will provide instruction on configuring a Ubuntu server with Postgress and Nginx and deploying your application.

### Deploying to Fresh Ubuntu 17.10


#### Install all updates

```
sudo apt-get update && sudo apt-get upgrade -y
```

#### Install pre-requisites

```
sudo apt-get install npm python3 python3-pip python3-dev virtualenv -y
sudo apt-get install libpq-dev postgresql postgresql-contrib nginx -y
```

Upgrade pip 

```
sudo -H pip3 install --upgrade pip
```

#### Create a PostgresSQL Database

By default DAWS uses a SQLite3 database. If you want to use Postgres follow these
instructions.

```
# initiate postrgres console
sudo -u postgres psql

# create the database
postgres=# CREATE DATABASE daws;

```

Configure the user account in Postgres:

"We are setting the default encoding to UTF-8, which Django expects. We are also setting the default transaction isolation scheme to "read committed", which blocks reads from uncommitted transactions. Lastly, we are setting the timezone. By default, our Django projects will be set to use UTC. These are all recommendations from the Django project itself:"

```
# create the user
CREATE USER dawsuser WITH PASSWORD 'password';

# configure the user
ALTER ROLE dawsuser SET client_encoding TO 'utf8';
ALTER ROLE dawsuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE dawsuser SET timezone TO 'UTC';

# grant permissions to the database
GRANT ALL PRIVILEGES ON DATABASE daws TO dawsuser;
```

And finally exit the Postgres prompt.

```
postgres=# \q
```

#### Project Setup


##### Setup your SSH key

If you do not have an .ssh key setup, create one now. Your project is also likely
a private repository, so you will need to add your .ssh key to GitHub before you
can clone your repo.

Create the SSH key
```
cd ~/.ssh && ssh-keygen
```

Follow these instructions to add your SSH key to GitHub.

https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/



##### Clone the repository

```
cd /var/www

git clone git@gitlab.com:codewiseio/Django-Angular-Webpack-Starter.git daws

# or

git clone https://github.com/codewiseio/Django-Angular-Webpack-Starter.git daws
```

##### Setup Environment

Create a virtual environment for python.

```
cd daws

# create environmnet
virtualenv -p python3 venv

# activate the environment
source venv/bin/activate

# install python modules
pip install -r requirements.txt
pip install djangorestframework-jwt

# install gunicorn and and the psycopg2 Postgres adaptor
pip install gunicorn psycopg2
```

##### Edit Local Configuration

All your local configuration settings should be made in the `app/settings_local.py`
file. Your production installation does not touch the `app/settings.py` which will
be over-written on application updates.

```
vi app/settings_local.py
```

Copy the following settings `settings_local.py` file as needed.

Add your ip address or domain name to the allowed hosts.

```
ALLOWED_HOSTS = ['your_server_domain_or_IP', 'second_domain_or_IP', ...]
```


If you are using email in your application:

```
EMAIL_HOST = 'smtp.sendgrid.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = '...'
EMAIL_USE_TLS = True
```

If you want to use a Postgres database:

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'daws',
        'USER': 'dawsuser',
        'PASSWORD': 'dawspassword',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```



##### Complete Project Setup

Migrate the database

```
python manage.py migrate
```

Create the primary super user account

```
python manage.py createsuperuser
```

Collect the static content

```
python manage.py collectstatic
```


You can test the the project is setup correctly by running the Django development server.


Open port 8000
```
sudo ufw allow 8000
```

Start the server

```
python manage.py runserver 0.0.0.0:8000
```

View in your browser

```
http://server_domain_or_IP:8000
```

Test the super user account by navigating to:

```
http://server_domain_or_IP:8000/admin
```

##### Test Gunicorn's Ability to Serve Project

```
gunicorn --bind 0.0.0.0:8000 app.wsgi
```

And view in your browser.

```
http://server_domain_or_IP:8000
```

If everything is working up until this point you can deactivate the virtual environment.

```
deactivate
```


### Configure the Web Server

We will be using Gunicorn and Nginx to serve application.



#### Create a user for the application

We will create a user specifically for the application for security purposes.

```
useradd -r daws -s /bin/false
```

Check to see that user was added succesfully

```
cat /etc/passwd
```

Set this user's primary group to `www-data`.

```
sudo usermod -g www-data daws
```

Change the ownership of project directory and files.

```
sudo chown -r /var/www/daws daws:www-data
```



#### Create a service for the application

First we will create a systemd service which will be used to spin up Gunicorn
and create a linux socket file.

```
[Unit]
Description=DAWS Daemon
After=network.target

[Service]
User=daws
Group=www-data
WorkingDirectory=/var/www/daws
ExecStart=/var/www/daws/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/var/www/daws/app.sock app.wsgi:application

[Install]
WantedBy=multi-user.target
```

You can check that the service was started successfully by checking for the
existence of the `app.sock` file.

```
ls /var/www/daws
```

If there is no `app.sock` check the logs.

```
sudo journalctl -u gunicorn
```


#### Configure Nginx

Create a new configuration file for the site.

```
sudo vi /etc/nginx/sites-available/daws
```


Add the following to the file.

```
server {
    listen 80;
    server_name 0.0.0.0;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /var/www/daws/www;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/daws/app.sock;
    }
}
```


Enable the site.

```
sudo ln -s /etc/nginx/sites-available/daws /etc/nginx/sites-enabled
```

Test the configuration.

```
sudo nginx -t
```

Restart Nginx

```
sudo systemctl restart nginx
```

Remove access to port `8000` and open access to Nginx.

```
sudo ufw delete allow 8000
sudo ufw allow 'Nginx Full'
```

Test that the server is working correctly by pointing your browser to:

```
http://your-domain-or-ip/
```

Update the server or domain name in the administrator panel.

* Navigate to the "Sites" section
* Update the existing site to point to your ip address or domain name


### Setup SSL Encryption

#### Self Signed Certificate

If setting up SSL on an ip address (no domain name) you can create a self
signed certificate. [reference](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04)


##### Create the certificate

Create the certificate and Diffie-Hellman Group file.

```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt

sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

##### Configure Nginx

Create a configuration snippet that points to the certificates.

```
sudo vi /etc/nginx/snippets/self-signed.conf

### file contents ###

ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
```

Create a configuration file that sets strong security settings.

```
sudo vi /etc/nginx/snippets/ssl-params.conf

### file contents ###

# from https://cipherli.st/
# and https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html

ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_ecdh_curve secp384r1;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
# Disable preloading HSTS for now.  You can use the commented out header line that includes
# the "preload" directive if you understand the implications.
#add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;

ssl_dhparam /etc/ssl/certs/dhparam.pem;
```

Backup your site configuration.

```
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak
```

Open your site configuration for editing.
```
sudo vi /etc/nginx/sites-available/default

### modify the file ###

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    # forwards http requests to https
    server_name server_domain_or_IP;
    return 302 https://$server_name$request_uri;

    # SSL configuration

    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    include snippets/self-signed.conf;
    include snippets/ssl-params.conf;

    ...
```

Test the configuration

```
sudo nginx -t
```

Restart Nginx

```
sudo systemctl restart nginx
```

Navigate to the site in your browser.

```
https://your-site-or-ip
```

You will receive a warning about the site not being secure. This is
because the certificate is self signed.






### Reference
https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04




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