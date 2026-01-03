"""
Acoustic Analysis Module for Fraud Detection

This module handles audio feature extraction and analysis for fraud detection.
"""

import numpy as np
import librosa
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)

class AcousticAnalyzer:
    """
    Acoustic analysis for fraud detection using MFCC and other audio features.
    """

    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
        self.mfcc_features = 13
        self.n_fft = 2048
        self.hop_length = 512

    def extract_mfcc(self, audio_data: np.ndarray) -> np.ndarray:
        """
        Extract MFCC features from audio data.

        Args:
            audio_data: Raw audio waveform

        Returns:
            MFCC coefficients (n_frames, n_mfcc)
        """
        try:
            mfcc = librosa.feature.mfcc(
                y=audio_data,
                sr=self.sample_rate,
                n_mfcc=self.mfcc_features,
                n_fft=self.n_fft,
                hop_length=self.hop_length
            )
            return mfcc.T  # Transpose to (n_frames, n_mfcc)
        except Exception as e:
            logger.error(f"MFCC extraction failed: {e}")
            return np.array([])

    def normalize_noise(self, audio_data: np.ndarray) -> np.ndarray:
        """
        Apply noise normalization to audio data.

        Args:
            audio_data: Raw audio waveform

        Returns:
            Noise-normalized audio
        """
        try:
            # Simple noise reduction using spectral gating
            stft = librosa.stft(audio_data)
            magnitude, phase = librosa.magphase(stft)

            # Estimate noise from first few frames
            noise_frames = min(10, magnitude.shape[1] // 4)
            noise_profile = np.mean(magnitude[:, :noise_frames], axis=1, keepdims=True)

            # Apply spectral subtraction
            enhanced_magnitude = np.maximum(magnitude - noise_profile, 0)
            enhanced_stft = enhanced_magnitude * phase

            # Inverse STFT
            enhanced_audio = librosa.istft(enhanced_stft)
            return enhanced_audio
        except Exception as e:
            logger.error(f"Noise normalization failed: {e}")
            return audio_data

    def detect_vocoder_artifacts(self, audio_data: np.ndarray) -> Dict[str, float]:
        """
        Detect synthetic speech artifacts (vocoder artifacts).

        Args:
            audio_data: Audio waveform

        Returns:
            Dictionary with artifact detection scores
        """
        try:
            # Calculate spectral features
            spectral_centroid = librosa.feature.spectral_centroid(
                y=audio_data, sr=self.sample_rate
            )[0]

            spectral_rolloff = librosa.feature.spectral_rolloff(
                y=audio_data, sr=self.sample_rate
            )[0]

            # Calculate zero-crossing rate
            zero_crossing_rate = librosa.feature.zero_crossing_rate(audio_data)[0]

            # Calculate spectral flatness
            spectral_flatness = librosa.feature.spectral_flatness(
                y=audio_data
            )[0]

            # Artifact detection heuristics
            centroid_variation = np.std(spectral_centroid) / np.mean(spectral_centroid)
            rolloff_consistency = 1 - np.std(spectral_rolloff) / np.mean(spectral_rolloff)
            flatness_uniformity = np.mean(spectral_flatness)

            # Combine features for artifact score (0-1, higher = more likely synthetic)
            artifact_score = (
                centroid_variation * 0.3 +
                (1 - rolloff_consistency) * 0.3 +
                flatness_uniformity * 0.4
            )

            return {
                "artifact_score": min(max(artifact_score, 0), 1),
                "centroid_variation": centroid_variation,
                "rolloff_consistency": rolloff_consistency,
                "flatness_uniformity": flatness_uniformity
            }
        except Exception as e:
            logger.error(f"Vocoder artifact detection failed: {e}")
            return {"artifact_score": 0.0}

    def analyze_audio_chunk(self, audio_data: np.ndarray) -> Dict[str, any]:
        """
        Complete acoustic analysis for an audio chunk.

        Args:
            audio_data: Raw audio waveform

        Returns:
            Dictionary with all acoustic features
        """
        try:
            # Normalize audio
            normalized_audio = self.normalize_noise(audio_data)

            # Extract MFCC
            mfcc_features = self.extract_mfcc(normalized_audio)

            # Detect artifacts
            artifact_analysis = self.detect_vocoder_artifacts(normalized_audio)

            # Calculate additional features
            rms_energy = librosa.feature.rms(y=normalized_audio)[0]
            pitch, _ = librosa.piptrack(y=normalized_audio, sr=self.sample_rate)

            return {
                "mfcc": mfcc_features,
                "rms_energy": np.mean(rms_energy),
                "pitch_mean": np.mean(pitch[pitch > 0]) if np.any(pitch > 0) else 0,
                "duration": len(audio_data) / self.sample_rate,
                **artifact_analysis
            }
        except Exception as e:
            logger.error(f"Audio chunk analysis failed: {e}")
            return {"error": str(e)}
