
---

## ✅ Prerequisites

Please install the following **before starting**:

### 🔹 Java & Maven
- Java JDK 17 or later
- Apache Maven (or use included `mvnw` wrapper)

### 🔹 Node.js & Angular CLI
- Node.js v18+ (https://nodejs.org)
- Angular CLI (install via `npm install -g @angular/cli`)

### 🔹 PostgreSQL
- Installed and **listening on port 1024**
- Default user assumed: `postgres`
- Default password assumed: `admin`

---

## 🗄 Step 1: PostgreSQL Database Setup

### A. Create the Database

```bash
createdb -U postgres -p 1024 evoluteam_db



psql -U postgres -p 1024 -d evoluteam_db -f backend/db_dump.sql



Step 2: Run the Backend (Spring Boot) : 
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
mvn clean install        
./mvnw spring-boot:run            




C. Start Angular App with Proxy : 
ng serve --proxy-config proxy.conf.json




💬 Common Errors & Fixes
❌ Database connection error
→ Check if PostgreSQL is running and port/credentials are correct

❌ Frontend cannot reach API
→ Make sure proxy.conf.json is used in ng serve

❌ JWT Authentication fails
→ Ensure backend is running and DB restored properly

❌ Port in use
→ Change backend or frontend port as needed

