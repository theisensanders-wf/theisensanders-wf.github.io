from app import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True)
    first = db.Column(db.String())
    last = db.Column(db.String())
    created = db.Column(db.DateTime())
    password = db.Column(db.String())
    salt = db.Column(db.String())
    admin = db.Column(db.Boolean())

    @property
    def display_name(self):
        return '%s %s' % (self.first, self.last)

    def __repr__(self):
        return '<Name: %s %s>' % (self.first, self.last)