import os
from django.core.urlresolvers import reverse_lazy

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


SECRET_KEY = '7*j9m*mok(+66l*1=%@yq#^jv=x)qq4a46%tj65bqydj(e@%)@'
STATIC_ROOT = os.sep.join(os.path.abspath(__file__).
                          split(os.sep)[:-3] + ['static'])
STATICFILES_DIRS = (BASE_DIR, 'statics')
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
# SESSION_SAVE_EVERY_REQUEST = True
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'
SMUGGLER_FIXTURE_DIR = '/dumps/'
DJANGO_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

LOCAL_APPS = (
    'apps.ventas',
    'apps.compras',
    'apps.pedidos',
    'apps.dashboard',
    'apps.reportes',
    'apps.contactos',
    'apps.inventario'
)

EXTERNAL_APPS = (
    'whitenoise',
    'openpyxl'
)


INSTALLED_APPS = DJANGO_APPS + LOCAL_APPS + EXTERNAL_APPS

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)
ROOT_URLCONF = 'versalles.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR, 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

LOGIN_URL = reverse_lazy('dashboard:login')
LOGIN_REDIRECT_URL = reverse_lazy('dashboard:panel')
LOGOUT_URL = reverse_lazy('dashboard:logout')

WSGI_APPLICATION = 'versalles.wsgi.application'
LANGUAGE_CODE = 'es-co'

TIME_ZONE = 'America/Bogota'

USE_I18N = True

USE_L10N = True

USE_TZ = True
