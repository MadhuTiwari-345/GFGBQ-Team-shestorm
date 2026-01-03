from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..app.database import get_db
from ..models.alert import Alert
from ..models.call import Call
from ..models.user import User
from ..routes.auth import get_current_user
from ..app.logging import logger

router = APIRouter()

@router.post("/trigger")
def trigger_alert(call_id: int, alert_type: str, message: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    call = db.query(Call).filter(Call.id == call_id, Call.user_id == current_user.id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    db_alert = Alert(call_id=call_id, alert_type=alert_type, risk_score=call.risk_score, message=message)
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    
    logger.warning(f"Alert triggered: {alert_type} for call {call_id} - {message}")
    
    return {"message": "Alert triggered successfully", "alert_id": db_alert.id}
