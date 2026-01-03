try:
    from sqlalchemy import Column, Integer, String, TIMESTAMP
    from sqlalchemy.sql.expression import text
    from ..app.database import Base

    class User(Base):
        __tablename__ = "users"

        id = Column(Integer, primary_key=True, nullable=False)
        username = Column(String, unique=True, nullable=False)
        email = Column(String, unique=True, nullable=False)
        hashed_password = Column(String, nullable=False)
        created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
except Exception:
    # Fallback lightweight User for environments without SQLAlchemy
    class User:
        def __init__(self, username=None, email=None, hashed_password=None):
            self.username = username
            self.email = email
            self.hashed_password = hashed_password

