from .base import *
import dj_database_url


DEBUG = True

ALLOWED_HOSTS = ['*']


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'vivero',
        'USER': 'postgres',
        'PASSWORD': '3a026d4c679acdcff8d984ed07af1293',
        'HOST': 'dokku-postgres-vivero',
        'PORT': '5432',

    }
}

STATIC_URL = '/static/'
