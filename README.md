*This project has been created as part of the 42 curriculum by ysumeral, iduman, yaycicek, akosaca and vzeybek.*

# Community Management System (CMS)

## Description

**Community Management System** is a web application built on a microservice architecture to manage communities and their members. Users can create communities or join them. Inside these communities, announcements and events can be shared, event attendance can be managed, and related actions can be done.

The project is me of separate services that have a single responsibility, and all of them work behind an Nginx gateway. User login (authentication) is done in a central place, and the services communicate with each other using internal REST endpoints.

**Main Features:**

- Authentication and user identity management (Auth and Id services)
- Community and membership management (Community and Membership services)
- Content: announcements, events, event participants, and file attachments (Content service)
- Central logging and monitoring (ELK Stack, Prometheus, Grafana, Node-Exporter, cAdvisor and AlertManager)

---

## Team Information

Role(s) and responsibilities for each team member:

- Ali Abbas KOŞACA - akosaca; Backend Developer; Backend service development
- İsmail Han DUMAN - iduman; Technical Lead & Backend Developer; Technical architecture, technology decisions, and critical code reviews
- Vedat ZEYBEK - vzeybek; Backend Developer; Backend service development
- Yunus Emre AYÇİÇEK - yaycicek; Project Owner & Frontend Developer; Frontend architecture, critical code reviews, and feature selection
- Yunus Emre Can SÜMERALP - ysumeral; Project Manager & Scrum Master; Team organization, Scrum management, and DevOps development

---

## Project Management

- **Work distribution:** The project is divided by services; each developer is responsible for one or more services.
- **Management tool:** GitHub Projects/Issues (features and tasks are tracked as issues).
- **Version control:** Git — our main development branch is the `dev` branch. Feature branches are opened from the related area's own sub-development branch (`frontend-dev`, `backend-dev`, `devops-dev`) (for example, `backend-content-*`). They return as a PR to the branch they started from; after a code review, they are merged. Finally, they are merged into the `prod` branch. Commits are in English and use the Conventional Commits style (`feat`, `fix`, `refactor`).
- **Communication channel:** Whatsapp / Google Meet / Topluyo :)
- **Meetings:** Main meetings were held regularly every Sunday. Near the end of the project, daily scrum meetings were held.

---

## Technical Stack

**Frontend:**
- Framework: `React`, `TailwindCSS`, `Typescript`, `TanStack Query`, `axios`, 

**Backend (Microservices):**
- `content`, `community`, `membership`, `id`, `log` — Node.js / Express
- `middleware` (JWT authentication) — Java / Quarkus
- `auth`, `orchestration` —  Python / fastAPI
- ORM: Prisma, sqlalchemy
- Nesne depolama: RustFS (S3 compatible)

**Database:**
- PostgreSQL — each service has its own separate database. (database-per-service pattern)
- Reason for choice: strong relational support, service isolation.

**Infrastructure and observability:**
- Gateway: Nginx (TLS termination, JWT authentication routing)
- Orchestration: Docker Compose
- Monitoring: Prometheus + Grafana
- Logging: Elasticsearch + Logstash + Kibana (ELK)

**Reasons for important technical choices:**
- **Backend as microservices:** Each service has a single responsibility; they are loosely coupled and can be scaled or deployed separately.
- **Node/Express/Prisma in the content service:** The `id` service was used as a reference to follow a consistent pattern.
- **RustFS:** An S3 compatible object storage solution that works on the local disk. It was used for file attachments; the full URL of the file is not saved in the database. The MinIO Service will stop being free in 2025. Because of this, RustFS, which is a MinIO fork, was chosen.
- **Choosing Python for Orchestration:** Not everyone on the team knew Node.js; FastAPI was chosen to quickly handle inter-service communication and data processing using Python.
- **Quarkus:** Quarkus was chosen over Java Spring Boot because Quarkus provides faster startup times and lower memory usage with native image support. This is a big advantage in a microservice architecture.
- **Jest.js:** Used for backend tests because Jest is a testing framework that runs in the Node.js environment and offers better integration.
- **AlertManager:** It provides a UI in addition to the Prometheus alert system, and we can manage actions like adding a Slack webhook. That is why we chose it.
- **Node-Exporter:** Chosen to export system metrics like CPU usage.
- **cAdvisor:** Chosen to export container data.

---

## Database Schema

### ID Service
 
* users
   * id: uuid, PK, default gen_random_uuid()
   * name: varchar(64)
   * picture: varchar(256), default null
   * role: enum('super_admin', 'normal'), default 'normal'
   * created_at: timestamptz now()

### Auth Service

* user_auth
   * id: uuid, PK, default gen_random_uuid()
   * user_id: uuid, FK
   * email: varchar(255), unique
   * password_hash: text not null

### Community Service
 
* communities
   * id: uuid, PK, default gen_random_uuid()
   * name: varchar(128)
   * slug: varchar(64), unique
   * description: TEXT
   * picture: varchar(255), default null
   * background_picture: varchar(255), default null
   * rules_path: varchar(255), null
   * status: enum('active', 'inactive')
   * visibility: enum('public', 'private')
   * access: enum('open', 'restricted', 'closed')
   * created_at: timestamptz now()

* tags
   * id: integer, PK, GENERATED ALWAYS AS IDENTITY
   * name: varchar(32), unique

* community_create_request_tags
   * request_id: uuid, FK
   * tag_id: integer, FK

* community_tags
   * community_id: uuid, FK
   * tag_id: integer, FK

* community_create_requests
   * id: uuid, PK, default gen_random_uuid()
   * rules_path: varchar(255), null
   * description: TEXT
   * user_id: uuid, FK
   * message: text
   * name: varchar(128)
   * picture: varchar(255), default null
   * background_picture: varchar(255), default null
   * status: enum('pending', 'approved', 'rejected')
   * access: enum('open', 'restricted', 'closed')
   * visibility: enum('public', 'private')
   * reviewed_by: uuid, FK, null
   * created_at: timestamptz now()
   * reviewed_at:  timestamptz, null

### Membership Service
 
* community_members
   * id: uuid, PK, default gen_random_uuid()
   * community_id: uuid, FK
   * user_id: uuid, FK
   * role: enum('member', 'moderator', 'admin')
   * joined_at: timestamptz, default now()

* moderator_permissions
   * id: uuid, PK, default gen_random_uuid()
   * community_id: uuid, FK
   * permission: jsonb  # this Array<String>

* community_join_requests
   * id: uuid, PK, default gen_random_uuid()
   * user_id: uuid, FK
   * community_id: uuid, FK
   * message: text
   * status: enum('pending', 'rejected', 'accepted')
   * reviewed_by: uuid, FK, null
   * reviewed_at: timestamptz, default null

### Content Service
 
* announcements
   * id: uuid, PK, default gen_random_uuid()
   * community_id: uuid, FK
   * author_id: uuid, FK
   * title: varchar(200)
   * content: text
   * pinned: boolean, default false
   * attachments: jsonb, null
   * visibility: enum('all', 'community_page', 'member', 'moderator')
   * created_at: timestamptz, default now()

* events
   * id: uuid, PK, default gen_random_uuid()
   * community_id: uuid, FK
   * author_id: uuid, FK
   * capacity: integer, null
   * title: varchar(200), not null
   * content: text, not null
   * attachments: jsonb, default null
   * pinned_until: timestamptz, null (<= end_at olmalı)
   * visibility: enum('all', 'member', 'moderator')
   * access: enum('all', 'member', 'moderator')
   * start_at: timestamptz
   * end_at: timestamptz, null
   * created_at:timestamptz, default now()

* event_participants
   * id: uuid, PK, default gen_random_uuid()
   * event_id: uuid, FK
   * user_id: uuid, FK
   * status: enum('requested', 'joined', 'no_show', 'rejected')
   * joined_at: timestampz, default now()

---

## Features List

- **UI Development:** Yunus Emre AYÇİÇEK; UI development of all pages and components
- **Authentication (auth/id/middleware):** İsmail Han DUMAN / Vedat ZEYBEK; Login, JWT generation, and identity management
- **Community management:** İsmail Han DUMAN; Creating/editing/viewing communities
- **Membership management:** İsmail Han DUMAN; Joining/leaving communities, roles
- **Content: (announcement/event/participant):** Ali Abbas KOŞACA; CRUD + file attachments, visibility control
- **Monitoring and Logging:** Yunus Emre Can SÜMERALP; Prometheus/Grafana + ELK