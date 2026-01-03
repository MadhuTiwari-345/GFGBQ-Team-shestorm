from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..app.database import get_db
from ..models.call import Call
from ..models.alert import Alert
from ..models.user import User
from ..routes.auth import get_current_user
from sqlalchemy import func

router = APIRouter()

@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_calls = db.query(func.count(Call.id)).filter(Call.user_id == current_user.id).scalar()
    total_alerts = db.query(func.count(Alert.id)).join(Call).filter(Call.user_id == current_user.id).scalar()
    avg_risk_score = db.query(func.avg(Call.risk_score)).filter(Call.user_id == current_user.id).scalar() or 0
    
    return {
        "total_calls": total_calls,
        "total_alerts": total_alerts,
        "average_risk_score": round(avg_risk_score, 2)
    }
