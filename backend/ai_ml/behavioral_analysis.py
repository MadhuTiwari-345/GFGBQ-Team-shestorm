"""
Behavioral Analysis Module for Fraud Detection

This module analyzes behavioral patterns in call data for fraud detection.
"""

import numpy as np
from typing import Dict, List, Tuple, Optional
from collections import deque, Counter
import logging
import time

logger = logging.getLogger(__name__)

class BehavioralAnalyzer:
    """
    Behavioral analysis for detecting manipulative patterns in calls.
    """

    def __init__(self, window_size: int = 100):
        self.window_size = window_size
        self.recent_patterns = deque(maxlen=window_size)
        self.call_history = []
        self.pattern_thresholds = {
            'repetition_threshold': 0.7,
            'script_consistency': 0.8,
            'behavioral_anomaly': 0.6
        }

    def analyze_call_behavior(self, call_data: Dict[str, any]) -> Dict[str, any]:
        """
        Analyze behavioral patterns in call data.

        Args:
            call_data: Dictionary containing call features

        Returns:
            Dictionary with behavioral analysis results
        """
        try:
            # Extract behavioral features
            speaking_patterns = self._analyze_speaking_patterns(call_data)
            repetition_analysis = self._detect_repetition(call_data)
            script_detection = self._detect_script_patterns(call_data)
            manipulation_indicators = self._detect_manipulation(call_data)

            # Calculate overall behavioral score
            behavioral_score = self._calculate_behavioral_score(
                speaking_patterns, repetition_analysis,
                script_detection, manipulation_indicators
            )

            # Update call history
            self.call_history.append({
                'timestamp': time.time(),
                'behavioral_score': behavioral_score,
                'patterns': speaking_patterns
            })

            return {
                "speaking_patterns": speaking_patterns,
                "repetition_analysis": repetition_analysis,
                "script_detection": script_detection,
                "manipulation_indicators": manipulation_indicators,
                "behavioral_score": behavioral_score,
                "call_history_length": len(self.call_history)
            }
        except Exception as e:
            logger.error(f"Behavioral analysis failed: {e}")
            return {"error": str(e)}

    def _analyze_speaking_patterns(self, call_data: Dict[str, any]) -> Dict[str, any]:
        """
        Analyze speaking patterns and pacing.

        Args:
            call_data: Call data dictionary

        Returns:
            Speaking pattern analysis
        """
        try:
            # Extract timing information
            pauses = call_data.get('pauses', [])
            speaking_duration = call_data.get('speaking_duration', 0)
            total_duration = call_data.get('total_duration', 1)

            # Calculate speaking metrics
            speaking_ratio = speaking_duration / total_duration
            avg_pause_length = np.mean(pauses) if pauses else 0
            pause_frequency = len(pauses) / max(speaking_duration, 1)

            # Detect unusual patterns
            rapid_speech = speaking_ratio > 0.9  # Speaking almost continuously
            hesitant_speech = pause_frequency > 2.0  # Frequent pauses
            scripted_delivery = avg_pause_length < 0.5  # Very short, consistent pauses

            return {
                "speaking_ratio": speaking_ratio,
                "avg_pause_length": avg_pause_length,
                "pause_frequency": pause_frequency,
                "rapid_speech": rapid_speech,
                "hesitant_speech": hesitant_speech,
                "scripted_delivery": scripted_delivery
            }
        except Exception as e:
            logger.error(f"Speaking pattern analysis failed: {e}")
            return {"error": str(e)}

    def _detect_repetition(self, call_data: Dict[str, any]) -> Dict[str, any]:
        """
        Detect repetitive phrases or patterns.

        Args:
            call_data: Call data dictionary

        Returns:
            Repetition analysis results
        """
        try:
            text_chunks = call_data.get('text_chunks', [])
            if not text_chunks:
                return {"repetition_score": 0.0}

            # Analyze phrase repetition
            phrases = []
            for chunk in text_chunks[-10:]:  # Last 10 chunks
                # Extract 3-5 word phrases
                words = chunk.split()
                for i in range(len(words) - 2):
                    phrase = ' '.join(words[i:i+3])
                    phrases.append(phrase.lower())

            # Count phrase frequencies
            phrase_counts = Counter(phrases)
            max_repetition = max(phrase_counts.values()) if phrase_counts else 1
            unique_phrases = len(phrase_counts)

            # Calculate repetition score
            repetition_score = min(max_repetition / len(phrases) * 10 if phrases else 0, 1.0)

            # Detect exact repetition patterns
            exact_repeats = sum(1 for count in phrase_counts.values() if count > 2)

            return {
                "repetition_score": repetition_score,
                "exact_repeats": exact_repeats,
                "unique_phrases": unique_phrases,
                "total_phrases": len(phrases)
            }
        except Exception as e:
            logger.error(f"Repetition detection failed: {e}")
            return {"repetition_score": 0.0}

    def _detect_script_patterns(self, call_data: Dict[str, any]) -> Dict[str, any]:
        """
        Detect scripted or rehearsed speech patterns.

        Args:
            call_data: Call data dictionary

        Returns:
            Script pattern detection results
        """
        try:
            # Analyze consistency in delivery
            speaking_patterns = call_data.get('speaking_patterns', {})
            acoustic_features = call_data.get('acoustic_features', {})

            # Script indicators
            consistent_pacing = speaking_patterns.get('scripted_delivery', False)
            uniform_pitch = acoustic_features.get('pitch_variation', 1.0) < 0.3
            low_emotional_variation = acoustic_features.get('emotional_range', 1.0) < 0.4

            # Calculate script consistency score
            script_indicators = [consistent_pacing, uniform_pitch, low_emotional_variation]
            script_consistency = sum(script_indicators) / len(script_indicators)

            # Check for common script phrases
            text_content = ' '.join(call_data.get('text_chunks', []))
            script_phrases = [
                "my name is",
                "i'm calling from",
                "this is regarding",
                "i need to verify",
                "please hold while"
            ]

            script_phrase_count = sum(1 for phrase in script_phrases if phrase in text_content.lower())

            return {
                "script_consistency": script_consistency,
                "consistent_pacing": consistent_pacing,
                "uniform_pitch": uniform_pitch,
                "low_emotional_variation": low_emotional_variation,
                "script_phrase_count": script_phrase_count
            }
        except Exception as e:
            logger.error(f"Script pattern detection failed: {e}")
            return {"script_consistency": 0.0}

    def _detect_manipulation(self, call_data: Dict[str, any]) -> Dict[str, any]:
        """
        Detect manipulative behavioral tactics.

        Args:
            call_data: Call data dictionary

        Returns:
            Manipulation detection results
        """
        try:
            semantic_scores = call_data.get('semantic_scores', {})
            emotional_analysis = call_data.get('emotional_analysis', {})

            # Manipulation indicators
            high_pressure = semantic_scores.get('urgency_score', 0) > 0.7
            authority_claims = semantic_scores.get('authority_score', 0) > 0.6
            emotional_manipulation = emotional_analysis.get('fear_induction', 0) > 0.5
            information_gathering = semantic_scores.get('personal_info_score', 0) > 0.4

            # Calculate manipulation score
            manipulation_factors = [
                high_pressure, authority_claims,
                emotional_manipulation, information_gathering
            ]
            manipulation_score = sum(manipulation_factors) / len(manipulation_factors)

            return {
                "manipulation_score": manipulation_score,
                "high_pressure": high_pressure,
                "authority_claims": authority_claims,
                "emotional_manipulation": emotional_manipulation,
                "information_gathering": information_gathering
            }
        except Exception as e:
            logger.error(f"Manipulation detection failed: {e}")
            return {"manipulation_score": 0.0}

    def _calculate_behavioral_score(self, speaking_patterns: Dict,
                                   repetition_analysis: Dict,
                                   script_detection: Dict,
                                   manipulation_indicators: Dict) -> float:
        """
        Calculate overall behavioral risk score.

        Args:
            speaking_patterns: Speaking pattern analysis
            repetition_analysis: Repetition analysis
            script_detection: Script detection results
            manipulation_indicators: Manipulation detection results

        Returns:
            Behavioral risk score (0-1)
        """
        try:
            # Weighted combination of behavioral factors
            weights = {
                'repetition': 0.25,
                'script_consistency': 0.25,
                'manipulation': 0.3,
                'speaking_anomaly': 0.2
            }

            scores = {
                'repetition': repetition_analysis.get('repetition_score', 0),
                'script_consistency': script_detection.get('script_consistency', 0),
                'manipulation': manipulation_indicators.get('manipulation_score', 0),
                'speaking_anomaly': 1.0 if speaking_patterns.get('rapid_speech', False) or speaking_patterns.get('hesitant_speech', False) else 0.0
            }

            behavioral_score = sum(
                scores[component] * weight
                for component, weight in weights.items()
            )

            return min(max(behavioral_score, 0), 1)
        except Exception as e:
            logger.error(f"Behavioral score calculation failed: {e}")
            return 0.0
