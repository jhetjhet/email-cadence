# Code Assessment – Email Cadence

**Monorepo · TypeScript · NestJS · NextJS · Temporal**

This project implements an Email Cadence system using Temporal.io with a monorepo architecture powered by TypeScript. It consists of:

* **API** – NestJS backend
* **Worker** – Temporal worker
* **Web** – Next.js frontend

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```
## 2️⃣ Install Temporal CLI

Install and start the Temporal development server:

👉 [https://temporal.io/setup/install-temporal-cli](https://temporal.io/setup/install-temporal-cli)

After installation:

```bash
temporal server start-dev
```
## 3️⃣ Install Dependencies

From the project root:

```bash
npm install
```
## 4️⃣ Start the Applications

### ▶ Run All Apps

```bash
npm run dev
```
### ▶ Run Individual Apps

```bash
# Worker (Temporal)
npm run dev:worker

# API (NestJS)
npm run dev:api

# Web (Next.js)
npm run dev:web
```

# ⚙️ Configuration

## Worker Environment Variables

Create an `.env` file inside:

```
apps/worker/.env
```
Add the following:

```env
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=email-cadence-queue
```

# 📌 API Usage Examples
## 📨 Create a Cadence

**POST** `/cadences`

### Request Body

```json
{
  "id": "cad_123",
  "name": "Welcome Flow",
  "steps": [
    {
      "id": "1",
      "type": "SEND_EMAIL",
      "subject": "Welcome",
      "body": "Hello there"
    },
    {
      "id": "2",
      "type": "WAIT",
      "seconds": 10
    },
    {
      "id": "3",
      "type": "SEND_EMAIL",
      "subject": "Follow up",
      "body": "Checking in"
    }
  ]
}
```
## 👤 Create an Enrollment

**POST** `/enrollments`

### Request Body

```json
{
  "cadenceId": "cad_123",
  "contactEmail": "test@email.com"
}
```

### Response

```json
{
  "enrollmentId": "<UUID>"
}
```

## 🔍 Poll Enrollment Status

**GET** `/enrollments/<enrollment_id>`

### Response

```json
{
  "currentStepIndex": 1,
  "stepsVersion": 1,
  "status": "RUNNING"
}
```

## 🔄 Update Enrollment Steps

**POST** `/enrollments/<enrollment_id>/update-cadence`

### Request Body

```json
[
  {
    "id": "1",
    "type": "SEND_EMAIL",
    "subject": "Welcome",
    "body": "Hello there"
  },
  {
    "id": "2",
    "type": "WAIT",
    "seconds": 10
  },
  {
    "id": "3",
    "type": "SEND_EMAIL",
    "subject": "Updated Follow up",
    "body": "Updated cadence steps"
  }
]
```

# Monorepo Structure

```
apps/
 ├── api/        # NestJS backend
 ├── worker/     # Temporal worker
 └── web/        # Next.js frontend
packages/
 └── shared/ # Shared TypeScript types used by api, worker, and web
```
