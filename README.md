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

---

## Modules

Selected modules and point calculation (Major = 2 points, Minor = 1 point).

### Selected Modules and Point Calculation

- **1. Use a frontend framework:** Minor (1 Point) - Developer: Yunus Emre AYÇİÇEK
- **2. Use a backend framework:** Minor (1 Point) - Developer: Ali Abbas KOŞACA / İsmail Han DUMAN / Vedat ZEYBEK
- **3. A public API:** Major (2 Points) - Developer: Ali Abbas KOŞACA / İsmail Han DUMAN
- **4. Use an ORM:** Minor (1 Point) - Developer: Ali Abbas KOŞACA / İsmail Han DUMAN
- **5. PWA:** Minor (1 Point) - Developer: İsmail Han DUMAN
- **6. Custom-made design system:** Minor (1 Point) - Developer: Yunus Emre AYÇİÇEK
- **7. Advanced Search:** Minor (1 Point) - Developer: İsmail Han DUMAN / Yunus Emre Can SÜMERALP
- **8. File upload and management system:** Minor (1 Point) - Developer: Ali Abbas KOŞACA / İsmail Han DUMAN / Yunus Emre AYÇİÇEK / Yunus Emre Can SÜMERALP
- **9. Accessibility Compliance:** Major (2 Points) - Developer: Yunus Emre AYÇİÇEK
- **10. Support for additional browsers:** Minor (1 Point) - Developer: Yunus Emre AYÇİÇEK
- **11. OAuth:** Minor (1 Point) - Developer: İsmail Han DUMAN
- **12. Advanced permissions system:** Major (2 Points) - Developer: İsmail Han DUMAN / Vedat ZEYBEK / Yunus Emre AYÇİÇEK / Ali Abbas KOŞACA
- **13. An organization system:** Major (2 Points) - Developer: İsmail Han DUMAN / Vedat ZEYBEK / Yunus Emre AYÇİÇEK / Ali Abbas KOŞACA
- **14. Log management using ELK:** Major (2 Points) - Developer: Yunus Emre Can SÜMERALP
- **15. Monitoring system with Prometheus and Grafana:** Major (2 Points) - Developer: Yunus Emre Can SÜMERALP
- **16. Backend as microservices:** Major (2 Points) - Developer: İsmail Han DUMAN / Vedat ZEYBEK / Yunus Emre AYÇİÇEK / Ali Abbas KOŞACA / Yunus Emre Can SÜMERALP
- **17. Data Visualization:** Major (2 Points) - Developer: Yunus Emre Can SÜMERALP
- **18. Data export/import:** Minor (1 Point) - Developer: Yunus Emre Can SÜMERALP / İsmail Han DUMAN
- **19. Custom Module:** Major (2 Points) - Developer: Yunus Emre Can SÜMERALP
- **20. Custom Module Smaller:** Minor (1 Point) - Developer: Yunus Emre Can SÜMERALP

**Total Points:** 29 Point (9 Major x 2 Point + 11 Minor x 1 Point)

---

## Module Details (Justification & Implementation)

### 1. Frontend framework (React)
*   **Type / Points:** Minor (1 Point)
*   **Justification:** Chosen to make UI development faster by building a modern, reactive, and component-based structure. It also helps to manage complex states in a modular way.
*   **Implementation:** The interface was developed as a Single Page Application (SPA) using React, TypeScript, and Vite.
*   **Team Member:** Yunus Emre AYÇİÇEK

### 2. Backend framework (FastAPI, Express, Quarkus)
*   **Type / Points:** Minor (1 Point)
*   **Justification:** Chosen because it allows fast development, is easy to expand, and works well with a microservices architecture.
*   **Implementation:** Microservices were built using Python FastAPI, Node.js Express, and Java Quarkus. Each service has its own independent database and they communicate through RESTful APIs.
*   **Team Member:** İsmail Han DUMAN, Ali Abbas KOŞACA, Vedat ZEYBEK

### 3. Public API
*   **Type / Points:** Major (2 Points)
*   **Justification:** Chosen so users and third-party apps can interact with the system. A public API makes data sharing and integration much easier.
*   **Implementation:**
  - We provided access to community, event, and announcement data using a RESTful API design.
  - JWT-based authentication and authorization mechanisms were applied.
*   **Team Member:** İsmail Han DUMAN, Ali Abbas KOŞACA, Vedat ZEYBEK

### 4. ORM (SQLAlchemy, Prisma)
*   **Type / Points:** Minor (1 Point)
*   **Justification:** Chosen to manage database operations more safely and efficiently. ORM allows us to write database queries in an object-oriented way and reduces database dependency.
*   **Implementation:**
  - SQLAlchemy was used in Python services.
  - Prisma was used in Node.js services.
*   **Team Member:** İsmail Han DUMAN, Ali Abbas KOŞACA

### 5. Progressive Web App (PWA)
*   **Type / Points:** Minor (1 Point)
*   **Justification:** Added to provide offline access, allow users to install the app on desktop or mobile devices, and give a native mobile app feeling.
*   **Implementation:** By configuring the `vite.config.ts` file, static files and API responses were cached. This way, the app can still work even when the internet connection is lost.
*   **Team Member:** Yunus Emre AYÇİÇEK, İsmail Han DUMAN

### 6. Custom-made design system
*   **Type / Points:** Minor (1 Point)
*   **Justification:** Chosen to keep the visual design consistent across the app and increase UI development speed without repeating code.
*   **Implementation:** A custom color palette, typography (like IBM Plex), and icon set were created using Tailwind CSS and Radix UI. More than 10 reusable components like buttons, modals, inputs, and dropdowns were built from scratch.
*   **Team Member:** Yunus Emre AYÇİÇEK

### 7. Advanced Search
*   **Type / Points:** Minor (1 Point)
*   **Justification:** Chosen to let users filter and search communities in more detail. This improves the user experience and makes data easy to reach. Also, Elasticsearch or a similar tool was needed to filter logs and monitoring data.
*   **Implementation:** Data querying and filtering were handled between the Orchestration, Community, Content, and Membership services. Fast and effective search results were provided by integrating a search engine like Elasticsearch. Additionally, Elasticsearch was used to index and filter logging and monitoring processes.
*   **Team Member:** İsmail Han DUMAN, Yunus Emre Can SÜMERALP

### 8. File upload and management system
*   **Type / Points:** Minor (1 Point)
*   **Justification:** Chosen so users can add files to their profiles, announcements, and events, and to manage these files easily.
*   **Implementation:** File upload, download, and management operations were handled using RustFS. Files are stored safely and made available to users.
*   **Team Member:** Ali Abbas KOŞACA / İsmail Han DUMAN / Yunus Emre AYÇİÇEK / Yunus Emre Can SÜMERALP

### 9. Complete accessibility compliance (WCAG 2.1 AA)
*   **Type / Points:** Major (2 Points)
*   **Justification:** Added to make the app inclusive. It provides a fully accessible experience for people who use screen readers, prefer keyboard navigation, or have visual impairments.
*   **Implementation:** Semantic HTML tags, necessary ARIA attributes, focus trap management, and WCAG 2.1 AA standard color contrast ratios were carefully applied.
*   **Team Member:** Yunus Emre AYÇİÇEK

### 10. Support for additional browsers
*   **Type / Points:** Minor (1 Point)
*   **Justification:** Targeted to prevent the app from depending on just one browser engine (like Chromium) and to ensure it works perfectly on different browsers (Firefox, Safari, Edge) without breaking.
*   **Implementation:** Cross-browser testing was actively done on different browsers.
*   **Team Member:** Yunus Emre AYÇİÇEK

### 11. OAuth (Google, 42)
*   **Type / Points:** Major (2 Points)
*   **Justification:** Chosen so users can log in to the app securely and quickly. OAuth improves the user experience by integrating with third-party identity providers and reduces the burden of password management.
*   **Implementation:** Google and 42 OAuth integrations were developed.
*   **Team Member:** İsmail Han DUMAN

### 12. Advanced permissions system
*   **Type / Points:** Major (2 Points)
*   **Justification:** Chosen so users can have different permission levels over communities and content. This system helps manage access rights based on user roles and increases overall security.
*   **Implementation:** Two main roles (superadmin and user) and community-based roles (admin, moderator, member) were defined. Permission checks were integrated with JWT-based authentication.
*   **Team Member:** İsmail Han DUMAN

### 13. An organization system
*   **Type / Points:** Major (2 Points)
*   **Justification:** Chosen to allow users to create communities, group together, and manage their organizations effectively.
*   **Implementation:** A community management module was developed where users can create organizations, invite members, and organize events specific to their groups.
*   **Team Member:** İsmail Han DUMAN

### 14. Log management using ELK
*   **Type / Points:** Major (2 Points)
*   **Justification:** To collect microservice logs in one central place and make it easier to track bugs and errors from the past.
*   **Implementation:** Backend service logs were sent to Logstash. Logstash processed these logs, sent them to Elasticsearch, and indexed them. All logs can now be searched and monitored centrally using the Kibana UI.
*   **Team Member:** Yunus Emre Can SÜMERALP

### 15. Monitoring system with Prometheus and Grafana
*   **Type / Points:** Major (2 Points)
*   **Justification:** To monitor the real-time health and performance of the server infrastructure and microservices, and to trigger alerts when needed.
*   **Implementation:** Container metrics were collected using cAdvisor, and server hardware metrics using Node-exporter. Prometheus pulls this data regularly, and Alertmanager was added for notifications. This data is visualized on Grafana to create real-time dashboards.
*   **Team Member:** Yunus Emre Can SÜMERALP

### 16. Backend as microservices
*   **Type / Points:** Major (2 Points)
*   **Justification:** To ensure that different modules in the project (auth, community, content) can work independently and be managed separately.
*   **Implementation:** Each backend module was set up in its own isolated environment. Services communicate only through HTTP/REST APIs, so if one service crashes or gets busy, it does not directly affect the others.
*   **Team Member:** İsmail Han DUMAN / Vedat ZEYBEK / Yunus Emre AYÇİÇEK / Ali Abbas KOŞACA / Yunus Emre Can SÜMERALP

### 17. Data Visualization
*   **Type / Points:** Major (2 Points)
*   **Justification:** To turn system metrics and complex log data into meaningful, instantly readable visual formats so we can quickly analyze the system's status.
*   **Implementation:** The collected data was turned into log visualizations using Kibana. Also, system metrics were modeled as simple, easy-to-follow dashboards on Grafana using Gauge charts.
*   **Team Member:** Yunus Emre Can SÜMERALP

### 18. Data export/import
*   **Type / Points:** Minor (1 Point)
*   **Justification:** Chosen so users can do bulk data operations and export their data in different formats. This feature makes it easy for users to back up their data and integrate with other systems.
*   **Implementation:** Bulk data operations, export, and import tasks were handled using Adminer and the source services. CSV, JSON, and XML formats are supported.
*   **Team Member:** Yunus Emre Can SÜMERALP / İsmail Han DUMAN

### 19. Custom Module (cAdvisor, Filebeat Exporters & RustFS)
*   **Type / Points:** Major (2 Points)
*   **Justification:** To collect container metrics stably, and to provide a fast, secure, and independent custom storage system using an S3-compatible API.
*   **Implementation:** cAdvisor was added to track real-time container resource usage, and Filebeat exporters were included for stable data collection. Additionally, a custom storage module called RustFS was built from scratch in Rust, offering an S3-compatible API for high-speed file management.
*   **Team Member:** Yunus Emre Can SÜMERALP

### 20. Custom Module Smaller (Adminer Service)
*   **Type / Points:** Minor (1 Point)
*   **Justification:** To control database management, tables, and records directly through a lightweight web interface without needing to install heavy GUI tools.
*   **Implementation:** The Adminer service, known for its lightweight structure that doesn't consume system resources, was added to the Docker environment. This made it easy to access databases quickly through the browser for management and querying.
*   **Team Member:** Yunus Emre Can SÜMERALP

---

## Instructions

### Prerequisites
To compile and run the project, the following tools must be installed on your system:
- Docker and Docker Compose
- `make` (for convenience commands)

### Configuration
Before starting the application, you need to set up the necessary environment variables and secret files.

**1. Root `.env` File:**
Create a `.env` file in the project root directory. You can use the following example as a template:

```env
# .env (Root directory)
DOMAIN_NAME=localhost
DATA_DIR=./data
COMPOSE_FILE=docker-compose.yml
```

**2. Service Environment Variables:**
Each service has its own `.env` file (e.g., `services/content/.env`). Complete your configuration by copying the example files in these directories:
```bash
cp services/content/.env.example services/content/.env
# Repeat this process for other services
```

**3. Secret Passwords (Secrets)**

For security reasons, passwords and sensitive keys are not stored in the `.env` file; they are read directly from text files inside the `secrets/` directory. 

The repository includes `.example` files to show you exactly which secrets are required. Before running the application, you must duplicate these example files, remove the `.example` extension, and replace the placeholder text with your actual passwords:

```bash
# 1. Create the actual secret files from the examples
cp secrets/db_password.example secrets/db_password.txt
cp secrets/42_client_secret.example secrets/42_client_secret.txt

# 2. Open the newly created .txt files and add your real credentials.
```

### Compilation & Execution
Once the necessary configurations are complete, you can build and start the system with a single command using `make`:

```bash
# Builds all containers and starts them in the background
make

When the system is up and running, the application will be served via the API Gateway on the following ports. (Local development uses an auto-generated self-signed certificate):
- **HTTPS:** `https://localhost:8443`
- **HTTP:** `http://localhost:8880`
```

### Useful Commands
Other `make` commands you can use to manage the system during the development process:

```bash
make down       # Stops and removes containers and networks
make re         # Completely restarts the system (runs down followed by up)
make logs       # Follows (tails) the logs of all services
make ps         # Lists the current status of running containers
make fclean     # Cleans up everything, including volumes (persistent data) and local images
```

---

## Resources

- https://github.com/auth0/jwt-decode
- https://github.com/lukeed/clsx
- https://github.com/dcastil/tailwind-merge
- https://lucide.dev/icons/
- https://www.radix-ui.com/primitives/docs/overview/introduction
- https://www.radix-ui.com/primitives/docs/components/dropdown-menu
- https://www.radix-ui.com/primitives/docs/components/select
- https://tailwindcss.com/
- https://zod.dev/basics
- https://zustand.docs.pmnd.rs/learn
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://axios.rest/pages/getting-started/first-steps.html
- https://www.youtube.com/watch?v=fpuHIS_bhXI
- https://www.youtube.com/watch?v=Ua__7-x6MWs
- https://www.youtube.com/watch?v=9AYN5UgKkoc
- https://www.npmjs.com/package/@aws-sdk/client-s3
- https://fastapi.tiangolo.com/tutorial/body/#import-pydantics-basemodel
- https://docs.sqlalchemy.org/en/20/changelog/migration_20.html#migration-orm-usage
- https://stackoverflow.com/questions/31684375/automatically-create-file-requirements-txt
- https://www.geeksforgeeks.org/python/how-to-create-requirements-txt-file-in-python/
- https://fastapi.tiangolo.com/advanced/response-change-status-code/#use-a-response-parameter
- https://stackoverflow.com/questions/51426983/how-to-compare-hashed-passwords-stored-as-strings-in-python-using-bcrypt
- https://www.prisma.io/docs/orm/next
- https://www.prisma.io/docs/orm/prisma-schema/overview
- https://www.prisma.io/docs/orm/reference/prisma-config-reference
- https://quarkus.io/guides/getting-started-reactive#reactive-jax-rs-resources
- https://quarkus.io/guides/rest#json-serialisation
- https://quarkus.io/guides/security-jwt
- https://docs.rustfs.com/en
- https://prometheus.io/docs/introduction/overview/
- https://www.elastic.co/docs
- https://grafana.com/docs/
- https://lucaberton.com/blog/fix-docker-containerd-failed-to-create-existing-container/#:~:text=No%20spam%2C%20unsubscribe%20anytime.%20*%201.%20cAdvisor,its%20migration%20to%20a%20fully%20containerd%2Dbacked%20engine

**AI usage:**

### AI Usage Summary

**Vedat Zeybek:**
We developed a solution for JWT management and validation with the help of ChatGPT. We also used to learn Quarkus and quickly understand its documentation.

**İsmail Han Duman:**
I worked with ChatGPT to learn AWS-SDK and Prisma functions, and to write queries and filters involving more than two services. I used Antigravity for code review to find long-hidden bugs. I consulted ChatGPT for documentation and code examples regarding Python, FastAPI, SQLAlchemy, and Pydantic. I also used AI to generate Regex patterns.

**Ali Abbas Kosaca:**
I used AI as a learning assistant. It supported me while learning Node.js, Prisma, and Docker from scratch. I used it to explain concepts and understand patterns using the id service as a reference. I discussed and evaluated options for design decisions with AI. It also helped me write the README file. In the end, the decisions and the code were mine; the AI simply acted as a teacher and accelerator.

**Yunus Emre Aycicek:**
I used AI for setting up the architecture and folder structure, following naming conventions, and improving the design of UI components. I also used it to learn new technologies, fix API errors, debug code, and write commit messages and PR descriptions.

**Yunus Emre Can SUMERALP:**
I used AI to learn how DevOps tools like ELK Stack, Grafana, and Prometheus work, how they communicate with exporters, and how to use them. I researched microservices architecture. I used it to figure out the endpoints for the tools in the entrypoint.sh scripts and got translation help while preparing the README. I also received help with technology decisions, especially when researching MinIO and the RustFS storage service. Additionally, I used it to research frontend and backend technologies to manage deployment processes. Overall, I used it mainly as a learning tool.

## Individual Contributions

### Team Challenge: Teamwork and Time

A significant challenge we faced was coordinating a five-member team with varying schedules. Because team members could not always contribute at full capacity simultaneously, we experienced occasional delays and uneven workloads.
To overcome this, we implemented daily check-ins to assess everyone's real-time availability. If a team member was unable to complete their assigned tasks due to time constraints, others with available capacity temporarily took over those responsibilities. This adaptive approach to task delegation and consistent communication ensured the project progressed smoothly and was completed on time.

### Detailed Breakdown of What Each Team Member Contributed

**Ali Abbas KOŞACA** — Backend Developer:
- CRUD operations and file attachment management for announcements, events, and participants.
- Transitioned from local disk storage to S3-compatible object storage (RustFS).
- Internal routes between services (visibility/access control, deleting users/communities).

**İsmail Han DUMAN** — Technical Lead:
- Technical leadership and microservice architecture design.
- Developed community management and membership management services.
- Implemented authentication and authorization mechanisms.
- Managed communication and data processing between microservices.
- Created temporary tests and test scenarios.
- Monitored and improved code quality and performance.
- Did PR (Pull Request) reviews and applied code standards.
- Created documentation and ensured maintainability.
- Developed the PWA (Progressive Web App) application and improved user experience.
- Optimized asset management and file upload processes.
- Designed database schemas and data modeling.
- Managed API design and integration processes.
- Contributed to DevOps processes.

**Vedat ZEYBEK** — Backend Developer:
- Developed authentication and authorization mechanisms.
- Configured Nginx and applied routing rules.
- Managed communication and data processing between microservices.
- Implemented cookie-based session management and security measures.
- Did PR reviews and applied code standards.
- Created documentation and ensured maintainability.
- Contributed to team collaboration and knowledge sharing.
- Helped make technical decisions during meetings.

**Yunus Emre AYÇİÇEK** — Project Owner, Frontend Architecture and UI Development:
- Built the Single Page Application (SPA) infrastructure from scratch using React, TypeScript, and Vite.
- Integrated Zustand for global state management and TanStack Query for asynchronous API requests, data fetching, and caching.
- Created a fully customized design system with dark mode support, containing over 10 reusable components using Tailwind CSS and Radix UI.
- Strictly applied WCAG 2.1 AA accessibility standards (semantic HTML, ARIA tags, focus trap, color contrast, and keyboard navigation) across the interface.
- Configured the application as a Progressive Web App (PWA).
- Ensured cross-browser compatibility.
- Challenges and solutions: Solved complex form management and validation by making it type-safe with *Zod*. Overcame accessibility challenges (especially keyboard focus management) in custom modal and dropdown components by using low-level *Radix UI Primitives*.

**Yunus Emre Can SÜMERALP** - Project Manager, Scrum Master, DevOps Architecture and Development:
- Tracked deadlines, managed daily scrums, and organized weekly meetings.
- Documented weekly meeting topics and determined the main subjects.
- Managed deployment processes on the DevOps side.
- Prepared CI/CD automations.
- Set Git branch rules and established standards for branch management.
- Implemented related technologies for the monitoring stack.
- Implemented ELK Stack for the logging stack.
- Prepared documentation and make commands to make developers jobs easier.
- Implemented a modular structure for Docker Compose files.
- Took part in choosing RustFS as a MinIO alternative for the storage service.
- Provided better visualization using Adminer and various exporters.