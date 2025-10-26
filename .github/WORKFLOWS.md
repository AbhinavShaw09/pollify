# GitHub Actions Workflows

## 🚀 **CI/CD Pipeline**

### **ci.yml** - Continuous Integration
- **Triggers**: Push/PR to `main` and `develop` branches
- **Jobs**:
  - **Backend Tests**: Python 3.12, pytest, all test files
  - **Frontend Tests**: Node.js 18, npm test
- **Status**: [![CI](https://github.com/AbhinavShaw09/pollify/actions/workflows/ci.yml/badge.svg)](https://github.com/AbhinavShaw09/pollify/actions/workflows/ci.yml)

### **cd.yml** - Continuous Deployment
- **Triggers**: Push to `main` branch, version tags
- **Jobs**:
  - Docker image builds
  - Integration tests
  - Deployment (placeholder)

### **code-quality.yml** - Code Quality Checks
- **Triggers**: Push/PR to `main` and `develop` branches
- **Jobs**:
  - **Backend**: flake8 linting, black formatting
  - **Frontend**: ESLint checks

### **test-matrix.yml** - Cross-Platform Testing
- **Triggers**: Weekly schedule, manual dispatch
- **Matrix**: Multiple OS (Ubuntu, Windows, macOS) and versions
- **Purpose**: Ensure compatibility across environments

## 📋 **Workflow Features**

- ✅ **Automated Testing** on every push/PR
- ✅ **Code Quality** checks (linting, formatting)
- ✅ **Cross-Platform** compatibility testing
- ✅ **Docker Integration** for deployment
- ✅ **Status Badges** for repository visibility

## 🔧 **Local Testing**

Before pushing, run locally:
```bash
# Backend tests
cd backend && python -m pytest app/tests/ -v

# Frontend tests  
cd frontend && npm test

# Code quality
cd backend && flake8 app && black --check app
cd frontend && npm run lint
```
