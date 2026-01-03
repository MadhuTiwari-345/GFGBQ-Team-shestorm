import pytest
from pydantic import BaseModel, Field, ValidationError

TRANSCRIPT_MAX_LENGTH = 5000


class TranscriptMessage(BaseModel):
    transcript: str = Field(..., max_length=TRANSCRIPT_MAX_LENGTH)


class AudioMessage(BaseModel):
    audio_data: str
    transcript: str | None = None


def test_transcript_validation_rejects_long_text():
    long_text = "a" * 10000
    with pytest.raises(ValidationError):
        TranscriptMessage(transcript=long_text)


def test_audio_message_accepts_base64_string():
    # audio_data is required but no validation of base64 occurs at pydantic level
    msg = AudioMessage(audio_data="not-a-base64", transcript="hi")
    assert msg.audio_data == "not-a-base64"
