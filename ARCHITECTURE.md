# EduGenie AI — System Architecture

This document describes the high-level system architecture, module relationships, and data pipelines for **EduGenie AI**.

---

## 🏗️ High-Level System Architecture

EduGenie AI is divided into a client frontend application, a backend API gateway server, local text parsing modules, and external API providers.

```mermaid
graph TD
    subgraph Client ["Frontend: Next.js Client (Port 3001)"]
        UI["React SPA & Components (Sidebar, Chats, Goals, Progress, Tests, Settings)"]
        Ctx["AppContext (Global State Management)"]
        AISv["AI Service (API Wrapper for Backend Calls)"]
    end

    subgraph API ["Backend Gateway: Node & Express (Port 3000)"]
        Idx["index.ts & routes/"]
        Ctrl["Controllers (chat, goal, material, progress, settings, test)"]
    end

    subgraph CoreServices ["Core Services"]
        MService["MaterialService (Document Processing & Text Extraction)"]
        OService["OcrService (Florence-2 OCR Image-to-Text)"]
        AService["AIService (Groq API Integrator)"]
    end

    subgraph Storage ["State Management & Database"]
        DB["memoryDb (In-memory Mock Database)"]
    end

    subgraph External ["External APIs & Models"]
        Groq["Groq Cloud API (llama-3.3-70b-versatile)"]
        HF["HuggingFace Inference (microsoft/Florence-2-large)"]
    end

    %% Client Interactions
    UI --> Ctx
    UI --> AISv
    AISv -- "HTTP /api/*" --> Idx

    %% Routing
    Idx --> Ctrl

    %% Controllers to Services/DB
    Ctrl -- "Fetch & Update Data" --> DB
    Ctrl -- "Generate Response" --> AService
    Ctrl -- "Process Uploaded File" --> MService

    %% Services Interconnections
    MService -- "Local Text Extraction (pdf-parse, mammoth)" --> DB
    MService -- "Scanned PDF/Image OCR Fallback" --> OService
    OService -- "Fetch Model Response" --> HF
    AService -- "Context-Enhanced Query" --> Groq
    AService -- "Read/Write Sessions & Messages" --> DB
```

---

## 🔄 Core Sequences & Pipelines

### 📁 Document Processing & OCR Pipeline
The document ingestion flow determines the best text extraction tool depending on the file format and structure:

```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant Frontend as Next.js App
    participant Express as Express Server
    participant MS as MaterialService
    participant OS as OcrService
    participant HF as HuggingFace (Florence-2)
    participant DB as memoryDb

    User->>Frontend: Upload Study Material (PDF/Image)
    Frontend->>Express: POST /api/materials (Multipart Form Data)
    Express->>MS: createMaterial(userId, fileMetadata)
    MS->>MS: extractText(filePath, fileName)
    alt Standard PDF / DOCX / TXT
        MS->>MS: Run pdf-parse / mammoth (Local Extraction)
    else Scanned PDF / Image (Text Length < 20 chars)
        MS->>MS: Convert PDF Pages to Images (pdf2pic)
        MS->>OS: extractTextFromImage(imagePath)
        OS->>HF: HuggingFace Image-to-Text API
        HF-->>OS: Extracted Text
        OS-->>MS: Extracted Text
    end
    MS->>DB: Save to memoryDb.studyMaterials
    MS-->>Express: Material Object (with extracted content)
    Express-->>Frontend: JSON Response (Material Object)
    Frontend-->>User: Update UI (Document Viewer & Linking Chat Context)
```

---

## 🗄️ In-Memory Database Schema (`memoryDb`)

The system manages state using a lightweight in-memory array database structured as follows:

```typescript
export const memoryDb = {
  users: [] as User[],
  settings: [] as Setting[],
  chatSessions: [] as ChatSession[],
  messages: [] as Message[],
  studyGoals: [] as StudyGoal[],
  progressTrackers: [] as ProgressTracker[],
  studySessions: [] as StudySession[],
  analytics: [] as Analytic[],
  practiceTests: [] as PracticeTest[],
  studyMaterials: [] as StudyMaterial[]
};
```

### Key Schema Types

#### 1. `StudyMaterial`
*   `id`: `string`
*   `userId`: `string`
*   `fileName`: `string`
*   `filePath`: `string`
*   `chatSessionId`: `string | null`
*   `content`: `string`
*   `extractionStatus`: `"SUCCESS" | "FAILED_OR_EMPTY"`
*   `size`: `number`
*   `mimeType`: `string`
*   `extractedTextLength`: `number`
*   `createdAt`: `Date`

#### 2. `ChatSession`
*   `id`: `string`
*   `userId`: `string`
*   `title`: `string`
*   `messages`: `Message[]`
*   `createdAt`: `Date`

#### 3. `Message`
*   `id`: `string`
*   `chatSessionId`: `string`
*   `role`: `"user" | "ai" | "system"`
*   `content`: `string`
*   `createdAt`: `Date`

#### 4. `StudyGoal`
*   `id`: `string`
*   `userId`: `string`
*   `title`: `string`
*   `status`: `"PENDING" | "COMPLETED"`
*   `createdAt`: `Date`

---

## 🧩 Module Interaction Specifications

### 1. Client App Module (`frontend`)
*   **Context Layer**: Tracks student profiles and current workspace views.
*   **Service Layer**: Handles network logic for document uploads and chat queries.
*   **View Layer**: Exposes onboarding UI, interactive chat workspace, test runner, goals manager, and settings.

### 2. Controller Module (`backend/controllers`)
*   Provides route middleware endpoints for the router definitions.
*   Directly interacts with memory database objects and coordinates backend services.

### 3. Extraction Module (`backend/services/material.service`)
*   Leverages `mammoth` for Word documents.
*   Leverages `pdf-parse` for standard PDFs.
*   Uses `pdf2pic` to generate images from scanned PDF pages, routing them to the OCR module.

### 4. OCR Module (`backend/services/ocr.service`)
*   Wraps the Hugging Face Inference client.
*   Uses Microsoft's **Florence-2-large** model for text extraction from images.
