# Bitespeed FluxKart

## API Documentation
- Base Url: `http://spookyhamme.me/api/v1`

### Endpoints

#### Get all contacts
```http
GET /all
```

#### Identify, create or link contact(s).
```http
POST /identify
```

request body:
```js
{
  email: string | null,
  phoneNumber: number | null
}
```

## Technologies Used
- NodeJS (with TypeScript)
- Express.js
- PostgreSQL
- Prisma ORM
- Docker
