from app.db.session import Base, engine
from app.models.user import User  # and other models as you build them

def init():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init()
    print("✅ Database tables created!")
