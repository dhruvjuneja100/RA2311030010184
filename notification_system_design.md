# Campus Notification System Design

## Overview
A backend microservice that delivers real-time notifications to students
about Placements, Events, and Results.

## System Architecture

### Components

1. **API Gateway**
   - Entry point for all incoming requests
   - Handles authentication and rate limiting
   - Routes requests to appropriate services

2. **Notification Service**
   - Core service that processes notification requests
   - Validates notification type and content
   - Triggers appropriate notification channels

3. **Queue Service**
   - Uses a message queue like Redis or RabbitMQ
   - Decouples notification creation from delivery
   - Ensures no notifications are lost if service is down

4. **Delivery Workers**
   - Consume messages from the queue
   - Send notifications via Email, SMS, Push
   - Retry failed deliveries automatically

5. **Database**
   - Stores notification history
   - Stores user preferences and subscription settings
   - Tracks delivery status per notification

6. **Logging Middleware**
   - Logs every notification event
   - Tracks success, failure, and retry attempts

## Notification Types

| Type | Description | Priority |
|------|-------------|----------|
| Placement | Job offers, interview schedules | High |
| Events | College events, workshops | Medium |
| Results | Exam results, grade releases | High |

## Data Flow

Student hits API Gateway which authenticates the request.
Notification Service validates and processes the notification.
Message is pushed to Queue for async delivery.
Delivery Workers consume and send to student devices.

## API Endpoints

### Create Notification
- Method: POST
- URL: /api/notifications
- Body: type, title, message, targetUsers

### Get Notifications
- Method: GET
- URL: /api/notifications/:userId
- Response: List of notifications for that user

### Mark as Read
- Method: PATCH
- URL: /api/notifications/:notificationId/read

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

## Key Design Decisions

1. **Message Queue** - Used to handle high volume of notifications
   during peak times like result declarations without crashing the system

2. **Retry Mechanism** - Failed notifications are retried up to 3 times
   with exponential backoff before being marked as failed

3. **Logging** - Every stage is logged using the Logging Middleware
   for easy debugging and monitoring

4. **Scalability** - Delivery workers can be scaled horizontally
   when notification volume increases

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Queue: Redis with BullMQ
- Database: PostgreSQL
- Logging: Custom Logging Middleware