<<<<<<< HEAD
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1yzCWOqlcnCj9ejwPrX2Ry8qxXp09pdRn

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
=======
# GFGBQ-Team-shestorm
Repository for shestorm - Vibe Coding Hackathon

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)


# 🛡️ Real-Time Audio Fraud Detection for Scam Prevention

### Conversation Intelligence for the AI vs AI Era (2026)

> **Social Cause Track**
> **Team SHESTORM**
> *In a world where every voice can be cloned, intent cannot hide.*

## 👥 Team & Contributors

**Team Name:** **SHESTORM**

### 👩‍💻 Contributors

| Name         | Role                              |
|--------------|-----------------------------------|
| Yamini        | Frontend & UX                     |
| Ishani Gupta | Backend & API Development         |
| Madhu Tiwari | AI / Machine Learning             |
| Khushi Verma | Research, Documentation & Testing |


📌 This project was collaboratively researched, architected, and implemented by **Team SHESTORM**.

## 📌 Introduction

Voice fraud has evolved from simple scam calls into **AI-powered psychological attacks**.

By 2026:

* Voices can be cloned in seconds
* AI agents conduct full persuasive conversations
* Phone numbers are trivially spoofed
* Victims are manipulated emotionally, not technically

Yet most systems still ask:

> *“Is this voice fake?”*

❌ This question is no longer sufficient.

### ✅ Our Approach

We introduce a **Real-Time Audio Fraud Detection System** that focuses on **detecting fraudulent intent and manipulative behavior during live conversations**, before irreversible actions are taken.

## ❗ Problem Statement

### Why current solutions fail:

* Call blockers rely on static number lists
* Voice authentication fails against human scammers
* Fraud detection is reactive
* Users are expected to “be careful”

📌 Financial loss happens **within seconds** of answering a call.

## 🧠 Core Philosophy

### Shift from *Identity → Intent*

Traditional systems focus on:

* Who is calling
* Whether the voice is real
* Whether the number is known

Our system focuses on:

* **Why** the caller is calling
* **What** they want the user to do
* **How** they manipulate emotions

📌 Numbers can be spoofed.
📌 Voices can be cloned.
📌 **Intent cannot hide.**

## 📞 How Fraud Appears in a Simple Call

Scam calls follow repeatable behavioral patterns:

* Authority impersonation (bank, police, government)
* Artificial urgency
* Isolation tactics (“don’t hang up”)
* Scripted conversation flow
* Forced financial actions (OTP, transfer)

Our system detects these patterns **in real time**, even on first-time calls.

## 🔍 How Fraud is Detected (Detailed Explanation)

### 1️⃣ Intent Detection — *What is being said*

Analyzes:

* Authority phrases (*bank, officer*)
* Urgency (*now, immediately*)
* Financial intent (*OTP, PIN*)
* Isolation (*don’t tell anyone*)

📌 Detection is based on **intent combinations**, not keywords.

### 2️⃣ Behavioral Analysis — *How it is said*

Detects:

* Rapid scripted speech
* Repetition
* Interruptions
* Dominant tone escalation

📌 Scammers follow scripts. Normal conversations adapt.

### 3️⃣ Emotional Manipulation Detection

Detects:

* Stress mismatch
* Fear induction
* Aggression inconsistent with role

📌 A “bank agent” using threats → **High-risk indicator**

## 🆚 Number-Based vs Conversation-Based Detection

### ❌ Number-Based

* Depends on blacklists
* Easily bypassed
* Fails on first contact

### ✅ Conversation-Based (Our System)

* Ignores phone numbers
* Analyzes live dialogue
* Detects fraud immediately

📌 Fraud is revealed by **conversation behavior**, not caller ID.


## 🆚 Competitive Advantage

| Competitor    | Strength       | Limitation           | Our Advantage                    |
| ------------- | -------------- | -------------------- | -------------------------------- |
| Pindrop       | Voice liveness | Misses intent        | Intent + behavior                |
| BioCatch      | User behavior  | Post-event detection | Real-time manipulation detection |
| Nuance        | IVR security   | High latency         | Edge-ready system                |
| Call Blockers | Number lists   | Easily spoofed       | Conversation intelligence        |

## ⚙️ System Architecture

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


## 🧠 AI / ML Pipeline

### Acoustic Layer

* MFCC & spectrogram features
* Vocoder artifact detection
* Noise-robust preprocessing

### Semantic Layer

* Streaming ASR
* Lightweight LLM / NLP classifier
* Intent categorization

### Behavioral Layer

* Speech cadence analysis
* Command repetition detection

### Risk Engine

* Multi-signal aggregation
* Continuous risk scoring
* Threshold-based alerts


## 🖥️ Backend Architecture

**Tech Stack**

* Python (FastAPI)
* WebSockets for live streams
* REST APIs

**Responsibilities**

* Audio chunk ingestion
* Model inference
* Risk aggregation
* Alert triggering
* Event logging

## 🎨 Frontend Architecture

**Web Dashboard**

* Live transcript
* Highlighted risky phrases
* Dynamic risk meter
* Alert notifications

**Mobile UI (Concept)**

* Floating warnings
* Vibration alerts
* Voice alerts
* Elder-friendly design

## 🗄️ Database Design

**Database**

* PostgreSQL / SQLite

**Stores**

* Call metadata
* Risk events
* Transcript snapshots
* Analytics logs

Optional:

* Vector DB for scam phrase embeddings

## 🧪 Dataset Strategy

### Why Synthetic Data?

* Privacy constraints
* Scarcity of real scam calls
* Controlled experimentation

### Dataset Contains

* Scam & normal scripts
* Emotional variations
* Noise profiles
* Multi-language samples

Labels:

* `0` → Safe
* `1` → Scam

## ✨ Key Features

* Real-time detection
* No prior enrollment
* Works on first-time calls
* Detects human & AI scams
* Noise & accent tolerant
* Conversation-based intelligence


## 🚀 Deployment & Future Scope

* Cross-platform fraud detection
* Telecom-level deployment
* AI watermark detection
* Multilingual support
* Regulatory compliance (GDPR/CCPA)


## 🏁 Conclusion

Voice fraud is no longer an audio problem.
It is a **human manipulation problem**.

This system acts as a **Real-Time Conversation Firewall**, protecting users before trust is exploited.

---

>>>>>>> d9e2c4a89ca02cf53194bf259c45aa408488eed3
