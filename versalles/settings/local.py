from .base import *

DEBUG = True

ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'vive',
        'USER': 'postgres',
        'PASSWORD': 'viejojavi',
        'PORT': '5433',

    }
}

STATIC_URL = '/statics/'
