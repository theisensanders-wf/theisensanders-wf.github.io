from os import environ

SECRET_KEY = 'this-is-the-secret-key-for-theisen-sanders'
DROPBOX_KEY = 'bd0brhufrmn92s5'
DROPBOX_SECRET = 'i6dv9ioihm4b69t'
DROPBOX_ACCESS_TYPE = 'app_folder'

SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URL')
if not SQLALCHEMY_DATABASE_URI:
    SQLALCHEMY_DATABASE_URI = 'postgresql://theisen:sanders@localhost/database'