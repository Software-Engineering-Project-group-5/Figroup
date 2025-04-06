# Figroup

## 🛠 Build, Test, and Deployment Instructions

Link to wiki: https://github.com/Software-Engineering-Project-group-5/Figroup/wiki

### Build Script Overview

Our project follows a CI/CD pipeline using GitHub Actions to ensure smooth compilation, testing, packaging, and deployment processes for both frontend and backend services. Below are the details of our setup:

### ⚙️ Build and Test Scripts

#### Backend

The backend service uses a GitHub Actions workflow to:

1. **Set up secrets**: Includes credentials such as the database connection string, third-party API keys, and service URLs.
2. **Setup Environment**:
   - Install Node.js (latest version).
   - Install all necessary dependencies.
3. **Sanity Check**:
   - Temporarily runs the backend service for a short period (~5 seconds) to verify the application starts correctly.
4. **Unit Testing**:
   - Executes 40 unit test cases to ensure code quality, redundancy handling, and integrity.

#### Frontend

The frontend workflow includes:

1. **Code Checkout**.
2. **Environment Setup**:
   - Install Node.js (latest version).
   - Install required frontend dependencies.
3. **Build Check**:
   - Run a production build to detect any compilation or syntactical errors.

Both workflows are triggered automatically on:
- Push to the repository.
- Pull request events.

Merging a pull request is only allowed if the CI pipeline passes all checks successfully.

---

### 🚀 Deployment (CD) Process

We use [Render](https://render.com/) for continuous deployment of both frontend and backend services. Here's how the deployment works:

- Our Render account is linked to the GitHub repository.
- When a change is pushed to either the frontend or backend directory:
  - Render detects the change and deploys the affected service.
  - Deployments occur **only if** the GitHub Actions CI pipeline passes.
  - If the CI fails, Render skips the deployment, ensuring stable services remain unaffected.
- The frontend and backend are deployed independently to allow modular updates.

---

### ✅ How to Trigger a Build

To manually trigger a build or test the pipeline locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Software-Engineering-Project-group-5/Figroup.git
   cd Figroup
   npm install
   ```
2. **Install dependencies (Backend)**:
   ```bash
   cd server
   node server
   cd ..
   npm test
   ```
3. **Install dependencies (Frontend)**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

For CI/CD workflows, pushing changes or creating a pull request will automatically trigger the pipeline.

---

### 📁 CI Pipeline Location

Our CI workflow files can be found here:  
🔗 [CI Pipeline Scripts – GitHub Workflows](https://github.com/Software-Engineering-Project-group-5/Figroup/tree/main/.github/workflows)

---

### 🧩 Pipeline Structure Diagram

![Editor _ Mermaid Chart-2025-04-05-221642](https://github.com/user-attachments/assets/ea91354a-6b69-4d49-93e3-66fc61afb375)


```
flowchart TD
    A[Push or Pull Request] --> B[Trigger GitHub Actions]
    
    B --> C1[Frontend CI Workflow]
    B --> C2[Server CI Workflow]
    
    C1 --> D1[Setup Node.js & Install Dependencies]
    D1 --> E1[Run Frontend Build (Syntax Check)]
    E1 --> F1[Frontend Build Successful]
    
    C2 --> D2[Setup Node.js & Install Dependencies]
    D2 --> D3[Run Unit Tests (40 Tests)]
    D3 --> D4[Sanity Check - Run Server 5s]
    D4 --> F2[Backend Test Successful]
    
    F1 & F2 --> G[CI Pipeline Passes]
    G --> H[Render Monitors GitHub]
    H --> I{Which service was updated?}
    
    I --> J1[Frontend Service Deployment]
    I --> J2[Backend Service Deployment]
    
    G -->|If any check fails| K[Abort Deployment]
```

---
