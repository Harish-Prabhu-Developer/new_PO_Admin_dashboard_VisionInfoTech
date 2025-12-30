# PO Admin Dashboard API - Documentation Index

## 📚 Documentation Files

### 1. **Swagger UI Interactive Documentation** 🎨
- **Location**: `http://localhost:5000/api-docs`
- **Type**: Interactive API browser
- **Access**: Browser-based Swagger UI
- **Features**: Test endpoints, view schemas, download specs

### 2. **Complete Setup Guide** 📖
- **File**: [SWAGGER_SETUP.md](./SWAGGER_SETUP.md)
- **Contents**: 
  - How to access Swagger UI
  - All endpoint descriptions
  - Data validation rules
  - Testing methods (cURL, Postman, etc.)
  - Troubleshooting guide
  - Environment setup

### 3. **Quick Reference** ⚡
- **File**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Contents**:
  - Quick start guide
  - Endpoint summary tables
  - Common curl examples
  - Status codes reference
  - Validation rules quick view

### 4. **OpenAPI Specification** 📋
- **File**: [src/swagger-docs/swagger.json](./src/swagger-docs/swagger.json)
- **Type**: OpenAPI 3.0.0 specification
- **Access**: `http://localhost:5000/api/v1/swagger.json`
- **Use**: Import into tools like Postman, Insomnia, etc.

---

## 🚀 Quick Links

### Start Here
1. Start the server: `npm run dev`
2. Open Swagger UI: `http://localhost:5000/api-docs`
3. Check health: `http://localhost:5000/health`

### Documentation by Role

#### 👨‍💻 Developers
- Read: [SWAGGER_SETUP.md](./SWAGGER_SETUP.md) - Complete technical documentation
- Reference: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick commands and examples
- Use: Swagger UI for testing

#### 🧪 QA / Testers
- Use: Swagger UI for endpoint testing
- Reference: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Test scenarios
- Check: Status codes and error responses

#### 📱 Frontend Developers
- Use: Swagger UI to understand API contracts
- Import: OpenAPI spec into development tools
- Reference: Request/Response schemas

#### 🏗️ DevOps / System Admins
- Deploy: Backend with Swagger documentation included
- Access: Swagger UI for API health monitoring
- Configure: Server URL in [src/swagger-docs/swagger.json](./src/swagger-docs/swagger.json)

---

## 📡 API Endpoints Overview

### General
```
GET  /                    → Welcome message
GET  /health              → Health status
GET  /api/v1/swagger.json → OpenAPI specification
```

### PO Header
```
POST   /api/v1/po/header/po-headers              → Create
GET    /api/v1/po/header/po-headers              → List all
GET    /api/v1/po/header/po-headers/{po_ref_no} → Get one
PUT    /api/v1/po/header/po-headers/{po_ref_no} → Update
DELETE /api/v1/po/header/po-headers/{po_ref_no} → Delete
```

### PO Detail 1
```
POST   /api/v1/po/detail1/po-details1           → Create
GET    /api/v1/po/detail1/po-details1           → List all
GET    /api/v1/po/detail1/po-details1/{id}      → Get one
GET    /api/v1/po/detail1/po-details1/ref/{po_ref_no} → By reference
PUT    /api/v1/po/detail1/po-details1/{id}      → Update
DELETE /api/v1/po/detail1/po-details1/{id}      → Delete
```

### PO Detail 2
```
POST   /api/v1/po/detail2/po-details2           → Create
GET    /api/v1/po/detail2/po-details2           → List all
GET    /api/v1/po/detail2/po-details2/{id}      → Get one
GET    /api/v1/po/detail2/po-details2/ref/{po_ref_no} → Additional costs
PUT    /api/v1/po/detail2/po-details2/{id}      → Update
DELETE /api/v1/po/detail2/po-details2/{id}      → Delete
```

### PO Detail 3
```
POST   /api/v1/po/detail3/po-details3           → Create
GET    /api/v1/po/detail3/po-details3           → List all
GET    /api/v1/po/detail3/po-details3/{id}      → Get one
GET    /api/v1/po/detail3/po-details3/ref/{po_ref_no} → By reference
PUT    /api/v1/po/detail3/po-details3/{id}      → Update
DELETE /api/v1/po/detail3/po-details3/{id}      → Delete
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or pnpm

### Installation
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with database configuration
# See SWAGGER_SETUP.md for details

# Run development server
npm run dev
```

### Access Points
- **API Base**: `http://localhost:5000`
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`
- **API Spec**: `http://localhost:5000/api/v1/swagger.json`

---

## 📝 Documentation Features

### ✅ What's Included
- [x] Interactive Swagger UI for all endpoints
- [x] Complete OpenAPI 3.0 specification
- [x] Request/response schemas with examples
- [x] Parameter documentation with validation rules
- [x] Error response documentation
- [x] Data model definitions
- [x] Server configuration for multiple environments
- [x] Try-it-out testing in Swagger UI
- [x] Postman/Insomnia import support
- [x] Quick reference guides

### 🔄 Common Workflows

#### Test an Endpoint
1. Open Swagger UI: `http://localhost:5000/api-docs`
2. Find endpoint in left panel
3. Click "Try it out"
4. Fill in parameters/body
5. Click "Execute"
6. View response

#### Import into Postman
1. Open Postman
2. Click "Import"
3. Enter: `http://localhost:5000/api/v1/swagger.json`
4. Click "Import"
5. All endpoints available in collections

#### Use with cURL
```bash
curl -X POST http://localhost:5000/api/v1/po/header/po-headers \
  -H "Content-Type: application/json" \
  -d '{"po_ref_no":"PO-001",...}'
```

---

## 🐛 Troubleshooting

### Swagger UI Not Loading
- Check server is running: `http://localhost:5000`
- Check logs for errors
- Verify port 5000 is available

### Can't Import to Postman
- Ensure server is running
- Try direct JSON file: `src/swagger-docs/swagger.json`
- Check network connectivity

### API Returns 404
- Verify endpoint path is correct
- Check base URL includes `/api/v1`
- Confirm resource exists in database

For more help, see [SWAGGER_SETUP.md](./SWAGGER_SETUP.md)

---

## 📞 Support

### Need Help?
1. **API Documentation**: Check Swagger UI at `http://localhost:5000/api-docs`
2. **Technical Details**: Read [SWAGGER_SETUP.md](./SWAGGER_SETUP.md)
3. **Quick Examples**: Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
4. **Raw Spec**: View [src/swagger-docs/swagger.json](./src/swagger-docs/swagger.json)

### Reporting Issues
When reporting issues, include:
- Error message from API response
- Request payload (if applicable)
- Server logs
- Endpoint being tested
- Expected vs actual behavior

---

## 📊 Documentation Statistics

| Item | Count |
|------|-------|
| Total Endpoints | 26 |
| GET Endpoints | 11 |
| POST Endpoints | 4 |
| PUT Endpoints | 4 |
| DELETE Endpoints | 4 |
| Error Responses Documented | 5+ |
| Data Models | 2+ |
| Documentation Files | 4 |

---

## 🔐 Version & Updates

- **API Version**: 1.0.0
- **OpenAPI Version**: 3.0.0
- **Last Updated**: December 29, 2024
- **Author**: HARISH PRABHU

---

**🎯 Start Testing Now: Open [Swagger UI](http://localhost:5000/api-docs)**
