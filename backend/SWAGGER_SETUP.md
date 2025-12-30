# Swagger UI Documentation Setup

## Overview
The Purchase Order (PO) Admin Dashboard API now includes comprehensive Swagger/OpenAPI documentation with an interactive UI for testing all endpoints.

## Features
- **Interactive API Documentation**: Explore all available endpoints with descriptions
- **Request/Response Examples**: See expected data formats for each endpoint
- **Try It Out**: Test API endpoints directly from the documentation UI
- **Schema Definitions**: View all data models and their properties
- **Validation Information**: Understand field requirements and constraints

## Accessing Swagger UI

### Development Environment
Once the server is running, access the Swagger UI at:

```
http://localhost:5000/api-docs
```

### Network Access
If accessing from another machine:

```
http://<your-server-ip>:5000/api-docs
```

## API Base URL
All API endpoints are prefixed with:

```
/api/v1
```

### Complete Endpoint Format
```
http://localhost:5000/api/v1/{resource}
```

## Implemented API Endpoints

### General Endpoints
- **GET** `/` - Welcome message and server information
- **GET** `/health` - Health check (API and Database status)

### Purchase Order Header (PO Header)
- **POST** `/po/header/po-headers` - Create new PO Header
- **GET** `/po/header/po-headers` - Get all PO Headers
- **GET** `/po/header/po-headers/{po_ref_no}` - Get specific PO Header
- **PUT** `/po/header/po-headers/{po_ref_no}` - Update PO Header
- **DELETE** `/po/header/po-headers/{po_ref_no}` - Delete PO Header

### Purchase Order Detail - Type 1
- **POST** `/po/detail1/po-details1` - Create PO Detail 1
- **GET** `/po/detail1/po-details1` - Get all PO Details 1
- **GET** `/po/detail1/po-details1/{id}` - Get specific PO Detail 1
- **GET** `/po/detail1/po-details1/ref/{po_ref_no}` - Get details by PO Reference
- **PUT** `/po/detail1/po-details1/{id}` - Update PO Detail 1
- **DELETE** `/po/detail1/po-details1/{id}` - Delete PO Detail 1

### Purchase Order Detail - Type 2
- **POST** `/po/detail2/po-details2` - Create PO Detail 2
- **GET** `/po/detail2/po-details2` - Get all PO Details 2
- **GET** `/po/detail2/po-details2/{id}` - Get specific PO Detail 2
- **GET** `/po/detail2/po-details2/ref/{po_ref_no}` - Get additional costs
- **PUT** `/po/detail2/po-details2/{id}` - Update PO Detail 2
- **DELETE** `/po/detail2/po-details2/{id}` - Delete PO Detail 2

### Purchase Order Detail - Type 3
- **POST** `/po/detail3/po-details3` - Create PO Detail 3
- **GET** `/po/detail3/po-details3` - Get all PO Details 3
- **GET** `/po/detail3/po-details3/{id}` - Get specific PO Detail 3
- **GET** `/po/detail3/po-details3/ref/{po_ref_no}` - Get details by PO Reference
- **PUT** `/po/detail3/po-details3/{id}` - Update PO Detail 3
- **DELETE** `/po/detail3/po-details3/{id}` - Delete PO Detail 3

## Starting the Server

### Development Mode with Auto-reload
```bash
npm run dev
```

### Production Build and Start
```bash
npm start
```

### Build Only
```bash
npm run build
```

## Required Environment Variables

Create a `.env` file in the `backend` directory with:

```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=5432
DB_NAME=your_database
NODE_ENV=development
PORT=5000
```

## Testing Endpoints

### Using Swagger UI
1. Open your browser and navigate to `http://localhost:5000/api-docs`
2. Click on any endpoint to expand its details
3. Click the "Try it out" button
4. Enter required parameters/body
5. Click "Execute" to send the request
6. View the response in the Response section

### Using curl
Example: Get all PO Headers
```bash
curl -X GET http://localhost:5000/api/v1/po/header/po-headers \
  -H "Content-Type: application/json"
```

Example: Create a PO Header
```bash
curl -X POST http://localhost:5000/api/v1/po/header/po-headers \
  -H "Content-Type: application/json" \
  -d '{
    "po_ref_no": "PO-001",
    "po_date": "2024-12-29",
    "company_id": 1,
    "supplier_id": 5,
    "created_by": "admin"
  }'
```

### Using Postman
1. Import the OpenAPI spec from: `http://localhost:5000/api/v1/swagger.json`
2. All endpoints will be automatically available in Postman
3. Use the "Try it out" feature to test each endpoint

## Response Status Codes

- **200** - Successful GET request
- **201** - Successful POST request (resource created)
- **400** - Bad request (validation error)
- **404** - Resource not found
- **500** - Internal server error
- **503** - Service unavailable (database disconnected)

## Common Error Responses

### Validation Error
```json
{
  "error": "Missing required fields: po_ref_no, po_date, company_id, supplier_id, created_by"
}
```

### Not Found
```json
{
  "error": "Purchase order not found"
}
```

### Database Error
```json
{
  "status": "Service Unavailable",
  "database": "disconnected",
  "error": "Connection timeout"
}
```

## Data Validation Rules

### PO Header
- `po_ref_no`: Required, max 50 characters
- `po_date`: Required, valid date format
- `company_id`: Required, positive integer
- `supplier_id`: Required, positive integer
- `created_by`: Required, max 50 characters
- `remarks`: Optional, max 2000 characters

### PO Detail 1
- `po_ref_no`: Required, max 50 characters
- `created_by`: Required, max 50 characters
- All numeric fields must be non-negative
- All string fields must respect max length constraints

### PO Detail 2 & 3
- Similar validation rules as Detail 1
- Reference-based queries available via `/ref/{po_ref_no}`

## Swagger Documentation File

The OpenAPI specification is located at:
```
backend/src/swagger-docs/swagger.json
```

### Structure
- **OpenAPI 3.0.0** compliant
- **Complete endpoint definitions** with parameters and responses
- **Data schemas** for all request/response bodies
- **Server configuration** for development and production
- **Tags** for grouping endpoints by functionality

## Customization

To update the Swagger documentation:

1. Edit `backend/src/swagger-docs/swagger.json`
2. Update endpoint descriptions, parameters, and responses
3. Restart the server
4. The Swagger UI will automatically reflect the changes

### Key Sections to Update
- `info`: API title, description, version
- `servers`: Add production server URL
- `paths`: All endpoint definitions
- `components.schemas`: Data models

## Documentation Best Practices

1. **Descriptive Summaries**: Each endpoint has a clear summary
2. **Detailed Descriptions**: Understand what each endpoint does
3. **Parameter Documentation**: Know what data each endpoint expects
4. **Response Examples**: See what to expect from each response
5. **Error Handling**: Understand possible error responses

## Troubleshooting

### Swagger UI Not Loading
- Verify the server is running: `http://localhost:5000/health`
- Check that `swagger-ui-express` is installed: `npm list swagger-ui-express`
- Check server logs for errors

### Invalid JSON in Swagger Definition
- Validate JSON syntax in `swagger.json`
- Use an online JSON validator
- Check for missing commas or quotes

### Swagger Document Not Updating
- Ensure server is restarted after changing `swagger.json`
- Clear browser cache
- Check browser console for errors

## Dependencies

The following packages are required (already installed):
- `swagger-ui-express`: ^5.0.1 - Express middleware for Swagger UI
- `swagger-jsdoc`: ^6.2.8 - Generate OpenAPI specification from code comments

## Additional Resources

- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.0)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Support

For issues or questions about the API:
1. Check the error response in Swagger UI
2. Review the validation rules in the documentation
3. Check the server logs for detailed error messages
4. Verify database connectivity using the `/health` endpoint

---

**Last Updated**: December 29, 2024
**API Version**: 1.0.0
**Author**: HARISH PRABHU
