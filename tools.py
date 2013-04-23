from app import db
from auth import actions as auth_actions


def setup_db():
    db.create_all()


def add_user():
    auth_actions.add_user('test@test.com', 'test', 'test', 'Theisen', 'Sanders')

if __name__ == "__main__":
    setup_db()