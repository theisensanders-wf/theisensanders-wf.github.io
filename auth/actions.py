from app import db
from auth import models as auth_models


def add_user(email, password, salt, first, last):
    user = auth_models.User(email=email,
                            password=password,
                            salt=salt,
                            first=first,
                            last=last)
    db.session.add(user)
    db.session.commit()
    return user
