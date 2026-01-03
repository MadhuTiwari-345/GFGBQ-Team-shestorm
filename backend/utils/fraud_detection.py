import re
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

# Make AI/ML analyzer imports resilient so tests and lightweight runs do not
# fail when heavy optional dependencies (like librosa) are not installed.
try:
    from ..ai_ml.acoustic_analysis import AcousticAnalyzer  # type: ignore
except Exception:
    class AcousticAnalyzer:  # type: ignore
        def analyze_audio_chunk(self, audio_data):
            return {"artifact_score": 0.0, "rms_energy": 0.0, "duration": 0.0}

try:
    from ..ai_ml.behavioral_analysis import BehavioralAnalyzer  # type: ignore
except Exception:
    class BehavioralAnalyzer:  # type: ignore
        def analyze_call_behavior(self, call_data: Dict[str, any]) -> Dict[str, float]:
            return {"behavioral_risk_score": 0.0}


class FraudDetectionService:
    def __init__(self):
        # Simple keyword-based fraud detection for demo
        self.fraud_keywords = [
            "urgent", "wire transfer", "bank account", "social security",
            "password", "credit card", "loan", "investment", "scam"
        ]
        self.high_risk_keywords = ["immediate action", "confidential", "secret"]

        # Initialize AI/ML analyzers (may be simple stubs if heavy deps missing)
        self.acoustic_analyzer = AcousticAnalyzer()
        self.behavioral_analyzer = BehavioralAnalyzer()

        # Risk scoring weights
        self.weights = {
            'keyword_score': 0.2,
            'acoustic_score': 0.3,
            'behavioral_score': 0.3,
            'semantic_score': 0.2
        }

    def analyze_data(self, data: str) -> float:
        """
        Analyze text/audio data and return risk score (0.0 to 1.0)
        """
        risk_score = 0.0
        data_lower = data.lower()
        
        # Count fraud keywords
        keyword_count = sum(1 for keyword in self.fraud_keywords if keyword in data_lower)
        risk_score += min(keyword_count * 0.1, 0.5)
        
        # Check for high-risk keywords
        high_risk_count = sum(1 for keyword in self.high_risk_keywords if keyword in data_lower)
        risk_score += min(high_risk_count * 0.2, 0.3)
        
        # Check for suspicious patterns (e.g., repeated urgent words)
        urgent_count = data_lower.count("urgent")
        risk_score += min(urgent_count * 0.05, 0.2)
        
        return min(risk_score, 1.0)
    
    def analyze_audio_transcript(self, transcript: str) -> dict:
        """
        Analyze audio transcript and return detailed analysis
        """
        # Use behavioral analyzer in a compatible way
        behavioral_analysis = self.behavioral_analyzer.analyze_call_behavior({"text_chunks": [transcript]})

        # Keyword analysis
        keyword_score = self.analyze_data(transcript)
        detected_keywords = [kw for kw in self.fraud_keywords if kw in transcript.lower()]

        # Calculate combined score
        combined_score = (
            self.weights['keyword_score'] * keyword_score +
            self.weights['behavioral_score'] * behavioral_analysis.get('behavioral_risk_score', 0.0) +
            self.weights['semantic_score'] * (keyword_score * 0.8)
        )
        combined_score = min(max(combined_score, 0.0), 1.0)

        return {
            "risk_score": combined_score,
            "keyword_risk": keyword_score,
            "behavioral_risk": behavioral_analysis.get('behavioral_risk_score', 0.0),
            "detected_keywords": detected_keywords,
            "behavioral_analysis": behavioral_analysis,
            "recommendation": "High risk - investigate immediately" if combined_score > 0.7 else "Monitor closely" if combined_score > 0.4 else "Low risk"
        }

    def analyze_audio_data(self, audio_array, transcript: Optional[str] = None) -> dict:
        """Analyze raw audio data (numpy array) and optional transcript."""
        try:
            acoustic_result = self.acoustic_analyzer.analyze_audio_chunk(audio_array)
        except Exception:
            acoustic_result = {"artifact_score": 0.0}

        acoustic_score = acoustic_result.get("artifact_score", 0.0)

        semantic_result = {}
        keyword_score = 0.0
        detected_keywords = []
        if transcript:
            semantic_result = self.analyze_audio_transcript(transcript)
            keyword_score = semantic_result.get("keyword_risk", 0.0)
            detected_keywords = semantic_result.get("detected_keywords", [])

        # Combine scores simply for now
        combined_score = (
            self.weights['acoustic_score'] * acoustic_score +
            self.weights['keyword_score'] * keyword_score +
            self.weights['behavioral_score'] * semantic_result.get('behavioral_risk', 0.0)
        )
        combined_score = min(max(combined_score, 0.0), 1.0)

        return {
            "overall_risk_score": combined_score,
            "acoustic_result": acoustic_result,
            "detected_keywords": detected_keywords,
            "semantic_result": semantic_result
        }
