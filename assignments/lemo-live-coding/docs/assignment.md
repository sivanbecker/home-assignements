# Interview Assignment — CAR Quote Engine

## Context

You are building a small local API for Lemonade's CAR insurance product. A prospective customer wants to get an insurance quote for one or more of their own cars. The system fetches the cars registered to the user from a vendor (simulated in-memory), enriches each car with an insurability flag, and then calculates premium quotes for the cars the user selects.

## Requirements

### Endpoints

#### `GET /cars`

Returns the list of cars registered to the user, fetched from a simulated vendor, each annotated with whether it is insurable by Lemonade.

Query parameters:
- `userId` (string, required) — the vendor lookup is keyed on this

Response: array of car objects, each with an `insurable` boolean:
```json
[
  { "id": "car-1", "make": "Toyota", "model": "Camry",   "year": 2020, "category": "sedan", "value": 25000, "insurable": true },
  { "id": "car-2", "make": "Ford",   "model": "Mustang", "year": 2005, "category": "sport", "value": 18000, "insurable": false }
]
```

Insurability rules (applied server-side after vendor fetch):
- Car must be manufactured in **2008 or later**
- Car `category` must not be `"exotic"`
- Car estimated value must be **under $150,000** (vendor provides value per car)

Non-insurable cars are still returned — the client decides whether to show or hide them.

#### `POST /quote`

Accepts a user profile and a selection of car IDs. Returns a premium quote per car and a combined multi-car quote.

Request body:
```json
{
  "user": {
    "age": 30,
    "licenseYear": 2018,
    "zipCode": "10001"
  },
  "carIds": ["car-1", "car-3"]
}
```

Response:
```json
{
  "quotes": [
    { "carId": "car-1", "premium": 1000 },
    { "carId": "car-3", "premium": 1100 }
  ],
  "combinedPremium": 1995,
  "discountApplied": true
}
```

### Pricing rules

Base annual premium per car: **$1000**

Risk factor multipliers (applied to base, stack multiplicatively):
- Driver age < 25: × 1.3
- License seniority < 3 years (current year − licenseYear): × 1.2
- Car category `"sport"`: × 1.5
- Car category `"suv"`: × 1.1
- Car category `"sedan"`: × 1.0 (no adjustment)

Multi-car discount: **5% off the combined premium** when 2 or more cars are selected.
All monetary values are annual premiums in USD, **rounded to the nearest integer**.

### Simulated vendor data

The vendor is simulated as a static in-memory map keyed by `userId`. Use this fixture:

```
userId "user-1" owns:
  { id: "car-1", make: "Toyota", model: "Camry",   year: 2020, category: "sedan", value: 25000 }
  { id: "car-2", make: "Ford",   model: "Mustang", year: 2005, category: "sport", value: 18000 }
  { id: "car-3", make: "Honda",  model: "CR-V",    year: 2019, category: "suv",   value: 32000 }

userId "user-2" owns:
  { id: "car-4", make: "BMW",    model: "M3",      year: 2022, category: "sport",  value: 72000 }
  { id: "car-5", make: "Ferrari",model: "488",     year: 2021, category: "exotic", value: 280000 }
  { id: "car-6", make: "Toyota", model: "Corolla", year: 2018, category: "sedan",  value: 15000 }
```

## Constraints

- Reuse the existing Fastify + TypeScript server foundation in this repo
- In-memory data only — no database
- Return `400` with a descriptive message if:
  - `userId` not found in vendor data
  - A requested `carId` does not exist or does not belong to the user
  - A requested car is not insurable (can't quote an uninsurable car)
  - User profile fails basic validation (age < 18)
- Tests must cover: insurability rules, pricing logic, multi-car discount, and HTTP layer
