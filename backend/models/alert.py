from sqlalchemy import Column, Integer, String, Float, TIMESTAMP, ForeignKey
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship
from ..app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, nullable=False)
    call_id = Column(Integer, ForeignKey("calls.id"), nullable=False)
    alert_type = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))

    call = relationship("Call")
