# Bitespeed FluxKart

## API Documentation
- Base Url: `http://spookyhamme.me/api/v1`

#### Endpoints
- `/all` get all contacts.
- `/identify` Identify, create or link contact(s).
request body:
```
{
    email: string,
    phoneNumber: number
}
```

## Technologies Used
- NodeJS (with TypeScript)
- Express.js
- PostgreSQL
- Prisma ORM
- Docker
