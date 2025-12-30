# Quick API Reference Guide

## 🚀 Quick Start

### Access Swagger UI
```
http://localhost:5000/api-docs
```

### Server Status
```
http://localhost:5000/health
```

## 📋 API Endpoints Summary

### Base URL
```
http://localhost:5000/api/v1
```

### PO Header Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/po/header/po-headers` | Create new PO Header |
| GET | `/po/header/po-headers` | List all PO Headers |
| GET | `/po/header/po-headers/{po_ref_no}` | Get specific PO Header |
| PUT | `/po/header/po-headers/{po_ref_no}` | Update PO Header |
| DELETE | `/po/header/po-headers/{po_ref_no}` | Delete PO Header |

### PO Detail 1 (Product Details)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/po/detail1/po-details1` | Create PO Detail 1 |
| GET | `/po/detail1/po-details1` | List all PO Details 1 |
| GET | `/po/detail1/po-details1/{id}` | Get specific PO Detail 1 |
| GET | `/po/detail1/po-details1/ref/{po_ref_no}` | Get by PO Reference |
| PUT | `/po/detail1/po-details1/{id}` | Update PO Detail 1 |
| DELETE | `/po/detail1/po-details1/{id}` | Delete PO Detail 1 |

### PO Detail 2 (Additional Costs)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/po/detail2/po-details2` | Create PO Detail 2 |
| GET | `/po/detail2/po-details2` | List all PO Details 2 |
| GET | `/po/detail2/po-details2/{id}` | Get specific PO Detail 2 |
| GET | `/po/detail2/po-details2/ref/{po_ref_no}` | Get additional costs |
| PUT | `/po/detail2/po-details2/{id}` | Update PO Detail 2 |
| DELETE | `/po/detail2/po-details2/{id}` | Delete PO Detail 2 |

### PO Detail 3
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/po/detail3/po-details3` | Create PO Detail 3 |
| GET | `/po/detail3/po-details3` | List all PO Details 3 |
| GET | `/po/detail3/po-details3/{id}` | Get specific PO Detail 3 |
| GET | `/po/detail3/po-details3/ref/{po_ref_no}` | Get by PO Reference |
| PUT | `/po/detail3/po-details3/{id}` | Update PO Detail 3 |
| DELETE | `/po/detail3/po-details3/{id}` | Delete PO Detail 3 |

## 📝 Common Request Examples

### Create PO Header
```bash
curl -X POST http://localhost:5000/api/v1/po/header/po-headers \
  -H "Content-Type: application/json" \
  -d '{
    "po_ref_no": "PO-2024-001",
    "po_date": "2024-12-29",
    "purchase_type": "Standard",
    "company_id": 1,
    "supplier_id": 5,
    "po_store_id": 10,
    "remarks": "Standard purchase order",
    "created_by": "admin"
  }'
```

### Get All PO Headers
```bash
curl -X GET "http://localhost:5000/api/v1/po/header/po-headers?page=1&limit=10"
```

### Get Specific PO Header
```bash
curl -X GET http://localhost:5000/api/v1/po/header/po-headers/PO-2024-001
```

### Update PO Header
```bash
curl -X PUT http://localhost:5000/api/v1/po/header/po-headers/PO-2024-001 \
  -H "Content-Type: application/json" \
  -d '{
    "po_date": "2024-12-30",
    "remarks": "Updated remarks"
  }'
```

### Delete PO Header
```bash
curl -X DELETE http://localhost:5000/api/v1/po/header/po-headers/PO-2024-001
```

### Create PO Detail 1
```bash
curl -X POST http://localhost:5000/api/v1/po/detail1/po-details1 \
  -H "Content-Type: application/json" \
  -d '{
    "po_ref_no": "PO-2024-001",
    "product_id": 123,
    "total_pcs": 100,
    "rate_per_pcs": 50,
    "product_amount": 5000,
    "created_by": "admin"
  }'
```

## ✅ Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |
| 503 | Service Unavailable - Database issue |

## 🔍 Validation Rules

### PO Header Required Fields
- `po_ref_no`: Max 50 chars, must be non-empty
- `po_date`: Valid date format
- `company_id`: Positive integer
- `supplier_id`: Positive integer
- `created_by`: Max 50 chars

### PO Detail Required Fields
- `po_ref_no`: Max 50 chars
- `created_by`: Max 50 chars

### Optional Fields
- All other fields are optional
- Numeric fields must be non-negative if provided
- String fields must not exceed max length

## 📦 Headers

All requests should include:
```
Content-Type: application/json
```

## 🔐 Authentication

Currently no authentication required. Add security headers as needed:
```
Authorization: Bearer <token>
```

## 💾 Data Types

| Type | Format | Example |
|------|--------|---------|
| string | Text | "PO-2024-001" |
| integer | Whole number | 123 |
| number | Decimal | 50.5 |
| date | YYYY-MM-DD | "2024-12-29" |
| datetime | ISO 8601 | "2024-12-29T15:30:00Z" |

## 🛠️ Testing Tools

### In Browser
- Swagger UI: `http://localhost:5000/api-docs`

### Command Line
- cURL (included with most OS)
- HTTPie: `http POST localhost:5000/api/v1/...`

### GUI Tools
- Postman: Import from `http://localhost:5000/api/v1/swagger.json`
- Insomnia: Same import URL
- Thunder Client (VS Code extension)

## ⚠️ Common Errors

### 400 Bad Request
Check that all required fields are included with correct data types.

### 404 Not Found
Verify the resource exists and the ID/reference number is correct.

### 500 Internal Server Error
Check server logs and database connectivity.

### 503 Service Unavailable
Database is not connected. Check database configuration and status.

## 🔗 Related Documentation

- [Full API Documentation](./SWAGGER_SETUP.md)
- [OpenAPI Spec](./src/swagger-docs/swagger.json)
- [Backend Code](./src/)

---

**For interactive testing, visit Swagger UI at `http://localhost:5000/api-docs`**
