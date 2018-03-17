from .base import *
import dj_database_url


DEBUG = True

ALLOWED_HOSTS = ['*']


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'versalles',
        'USER': 'postgres',
        'PASSWORD': 'luna',
        'HOST': 'localhost',
        'PORT': '5432',

    }
}

STATIC_URL = '/static/'
