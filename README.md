# FlowMind 🧠⚡
> **Intelligent Institutional Workflow Automation Platform**

FlowMind is an enterprise-grade, cloud-native **Responsive Web Application** designed to digitize, automate, and orchestrate complex administrative workflows across educational institutions, government bodies, and corporate enterprises. 

By unifying **Document Intelligence (OCR)**, a **Dynamic Rules Engine**, and an **Immutable Audit Trail**, FlowMind transforms slow, spreadsheet-heavy processes into transparent, auto-routed digital workflows.

---

## 📸 Key Features

* **FlowMind Portal (Applicant View):** Dynamic request submission forms, drag-and-drop document upload, AI OCR auto-fill, and a real-time progress tracker.
* **FlowMind Inbox (Approver View):** Role-based task queue, side-by-side original document comparison with extracted metadata, and one-click actions (**Approve**, **Reject**, **Request Revision**).
* **FlowMind Studio (Admin View):** No-code workflow rule builder (e.g., threshold routing) and a complete, searchable system audit log viewer.
* **Smart Ingestion Engine:** Asynchronous document reader powered by AI OCR that extracts text, total amounts, dates, and vendor metadata in under 3 seconds.

---

## 🏗 System Architecture

```mermaid
graph TD
    %% Client Presentation Layer
    subgraph Client["Presentation Layer (Next.js / Tailwind CSS)"]
        UI1[FlowMind Portal - Applicant]
        UI2[FlowMind Inbox - Approver]
        UI3[FlowMind Studio - Admin]
    end

    %% API Gateway
    subgraph Gateway["Backend Gateway (Node.js / Express)"]
        GW[API Gateway & Auth Guard]
    end

    %% Core Services
    subgraph Backend["Core Backend Services"]
        WE[Workflow Engine]
        RE[Rules Evaluator]
        OCR[AI Document OCR Service]
        NOTIF[Notification Engine]
    end

    %% Storage Layer
    subgraph Storage["Data & Storage Layer"]
        DB[(PostgreSQL Database)]
        S3[(AWS S3 / Local Storage)]
    end

    %% Connections
    UI1 --> GW
    UI2 --> GW
    UI3 --> GW

    GW --> WE
    GW --> RE
    GW --> OCR

    OCR --> S3
    WE --> DB
    WE --> NOTIF
    NOTIF --> UI1
    NOTIF --> UI2