---

## API Endpoints

### Create Notification
- **Method:** POST
- **URL:** `/api/notifications`
- **Body:**
```json
{
  "type": "placement",
  "title": "Interview Scheduled",
  "message": "Your interview with Google is on 10th May",
  "targetUsers": ["all"] 
}
```

### Get Notifications
- **Method:** GET
- **URL:** `/api/notifications/:userId`
- **Response:** List of notifications for that user

### Mark as Read
- **Method:** PATCH
- **URL:** `/api/notifications/:notificationId/read`

---

## Database Schema

### Notifications Table
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| type | STRING | placement/event/result |
| title | STRING | Notification title |
| message | STRING | Notification content |
| createdAt | TIMESTAMP | When created |
| status | STRING | pending/sent/failed |

### UserNotifications Table
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Target student |
| notificationId | UUID | Foreign key |
| isRead | BOOLEAN | Read status |
| deliveredAt | TIMESTAMP | Delivery time |

---

## Key Design Decisions

1. **Message Queue** — Used to handle high volume of notifications
   during peak times like result declarations without crashing the system

2. **Retry Mechanism** — Failed notifications are retried up to 3 times
   with exponential backoff before being marked as failed

3. **Logging** — Every stage is logged using the Logging Middleware
   for easy debugging and monitoring

4. **Scalability** — Delivery workers can be scaled horizontally
   when notification volume increases

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Queue:** Redis / BullMQ
- **Database:** PostgreSQL
- **Logging:** Custom Logging Middleware
