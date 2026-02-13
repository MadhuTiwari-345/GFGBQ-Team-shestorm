# 🛡️ GFGBQ – Team SheStorm  
## Real-Time Audio Fraud Detection for Scam Prevention  
### Conversation Intelligence for the AI vs AI Era (2026)

> **Social Cause Track – Vibe Coding Hackathon**  
> *In a world where every voice can be cloned, intent cannot hide.*

---

## 🌐 Live Application

🔗 **View App:**  
https://shestorm-ai-fraud-defender-73291669658.us-west1.run.app  

📂 **Demo + PPT (PDF):**  
https://drive.google.com/drive/folders/1y_DknpPaxDXdqYZMj07zlWCOonYMsOap?usp=sharing  

---

## 👥 Team SheStorm

| Name           | Role                              |
|---------------|-----------------------------------|
| Yamini        | Frontend & UX                     |
| Ishani Gupta  | Backend & API Development         |
| Madhu Tiwari  | AI / Machine Learning             |
| Khushi Verma  | Research, Documentation & Testing |

📌 This project was collaboratively researched, architected, and implemented by **Team SheStorm**.

---

# 📌 Problem Statement

## 🛑 Real-Time Audio Fraud Detection for Scam Prevention

Voice fraud has evolved from simple scam calls into **AI-powered psychological attacks**.

By 2026:

- Voices can be cloned in seconds  
- AI agents conduct full persuasive conversations  
- Phone numbers are trivially spoofed  
- Victims are manipulated emotionally, not technically  

Yet most systems still ask:

> “Is this voice fake?”

❌ That question is no longer enough.

---

# ✅ Our Approach

We introduce a **Real-Time Audio Fraud Detection System** that focuses on detecting **fraudulent intent and manipulative behavior during live conversations** — before irreversible financial actions occur.

Instead of identifying the caller, we identify the **conversation pattern**.

---

# 🧠 Core Philosophy

## Shift from *Identity → Intent*

Traditional systems focus on:

- Who is calling  
- Whether the voice is real  
- Whether the number is known  

Our system focuses on:

- **Why** the caller is calling  
- **What** they want the user to do  
- **How** they manipulate emotions  

📌 Numbers can be spoofed.  
📌 Voices can be cloned.  
📌 **Intent cannot hide.**

---

# 🔍 How Fraud is Detected

## 1️⃣ Intent Detection – *What is being said*

Analyzes:

- Authority phrases (bank, officer, government)  
- Urgency cues (now, immediately, final notice)  
- Financial triggers (OTP, PIN, transfer)  
- Isolation tactics (“don’t hang up”, “don’t tell anyone”)  

📌 Detection is based on **intent combinations**, not isolated keywords.

---

## 2️⃣ Behavioral Analysis – *How it is said*

Detects:

- Rapid scripted speech  
- Repetition patterns  
- Interruptions  
- Dominant tone escalation  

📌 Scammers follow scripts. Normal conversations adapt dynamically.

---

## 3️⃣ Emotional Manipulation Detection

Detects:

- Fear induction  
- Stress mismatch  
- Aggression inconsistent with role  

📌 A “bank agent” using threats = **High-risk indicator**

---

# 🆚 Detection Comparison

## ❌ Number-Based Detection

- Depends on blacklists  
- Easily bypassed  
- Fails on first-time calls  

## ✅ Conversation-Based Detection (Our System)

- Ignores phone numbers  
- Analyzes live dialogue  
- Detects fraud immediately  

📌 Fraud is revealed by **conversation behavior**, not caller ID.

---

# 🏆 Competitive Advantage

| Competitor     | Strength           | Limitation              | Our Advantage                          |
|---------------|-------------------|--------------------------|------------------------------------------|
| Pindrop       | Voice liveness     | Misses intent            | Intent + behavior analysis               |
| BioCatch      | User behavior      | Post-event detection     | Real-time manipulation detection         |
| Nuance        | IVR security       | High latency             | Edge-ready lightweight system            |
| Call Blockers | Number blacklists  | Easily spoofed           | Conversation intelligence-based detection|

---

# ⚙️ System Architecture

Live Audio Stream
↓
Acoustic Feature Extraction
↓
Real-Time Transcription
↓
Intent Analysis (NLP / LLM)
↓
Behavior & Emotion Analysis
↓
Risk Scoring Engine
↓
User Alert & Prevention


---

# 🧠 AI / ML Pipeline

## 🔹 Acoustic Layer
- MFCC & spectrogram features  
- Vocoder artifact detection  
- Noise-robust preprocessing  

## 🔹 Semantic Layer
- Streaming ASR  
- Lightweight NLP / LLM classifier  
- Intent categorization  

## 🔹 Behavioral Layer
- Speech cadence analysis  
- Command repetition detection  

## 🔹 Risk Engine
- Multi-signal aggregation  
- Continuous risk scoring  
- Threshold-based alerts  

---

# 🖥️ Backend Architecture

### Tech Stack
- Python (FastAPI)  
- WebSockets (live streaming)  
- REST APIs  

### Responsibilities
- Audio chunk ingestion  
- Model inference  
- Risk aggregation  
- Alert triggering  
- Event logging  

---

# 🎨 Frontend Architecture

## Web Dashboard
- Live transcript  
- Highlighted risky phrases  
- Dynamic risk meter  
- Real-time alert notifications  

## Mobile UI (Concept)
- Floating warning alerts  
- Vibration notifications  
- Voice alerts  
- Elder-friendly interface  

---

# 🗄️ Database Design

### Database
- PostgreSQL / SQLite  

### Stores
- Call metadata  
- Risk events  
- Transcript snapshots  
- Analytics logs  

Optional:
- Vector database for scam phrase embeddings  

---

# 🧪 Dataset Strategy

## Why Synthetic Data?
- Privacy constraints  
- Scarcity of real scam datasets  
- Controlled experimentation  

## Dataset Includes
- Scam & normal conversation scripts  
- Emotional tone variations  
- Noise profiles  
- Multi-language samples  

Labels:
- `0` → Safe  
- `1` → Scam  

---

# ✨ Key Features

- Real-time fraud detection  
- No prior user enrollment required  
- Works on first-time calls  
- Detects both human & AI-based scams  
- Noise & accent tolerant  
- Conversation intelligence driven  

---

# 🚀 Deployment & Future Scope

- Cross-platform fraud detection  
- Telecom-level integration  
- AI watermark detection  
- Multilingual expansion  
- Regulatory compliance (GDPR / CCPA)  

---

# 🧑‍💻 Run Locally

### Prerequisites
- Node.js  

### Setup

1. Install dependencies:
   ```bash
   npm install
