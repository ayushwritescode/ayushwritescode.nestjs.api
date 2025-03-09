# Backend 

(Hosted on Railway with CI/CD : https://easygeneratorapi-production.up.railway.app/api)

This repository contains the **Node.js / NestJS** backend for the application. It includes:

- **JWT Access/Refresh Token Flow** with HTTP-only cookies  
- **MongoDB** for data persistence  
- **Security Best Practices** (HTTP-only cookies, short-lived tokens, server-side validation)  
- **Rate Limiting** to prevent abuse and DDoS attacks  
- **Protection against XSS & CSRF attacks**  
- **Swagger API Documentation for easy testing and exploration**  
- **Modular Architecture** for maintainability  

---

## Key Highlights: Security Practices

1. **HTTP-only Cookies for Refresh Token**  
   Prevents XSS token theft – tokens are never exposed to JavaScript.

2. **Short-Lived Access Tokens**  
   Minimizes attack window if an access token is compromised.

3. **Automatic Token Refresh**  
   Uses a refresh token flow and Axios/NestJS interceptors to issue new tokens securely.

4. **No Tokens in localStorage**  
   Minimizes risk of stolen credentials and XSS attacks.

5. **Rate Limiting**  
   Protects against brute-force attacks and DDoS by limiting API request rates.

6. **Cross-Site Scripting (XSS) Prevention**  
   Uses Helmet.js and input validation to sanitize user inputs and prevent script injection.

7. **Cross-Site Request Forgery (CSRF) Protection**  
   Implements CSRF tokens and SameSite cookie policies to mitigate unauthorized API calls.

8. **Swagger API Documentation**  
   - Integrated using `@nestjs/swagger`
   - Provides interactive UI at `/api` to test endpoints
   - Helps developers explore and understand API usage easily
     
![image](https://github.com/user-attachments/assets/19471b36-a2b3-442f-b569-2b8de08e7345)

---

## Project Structure

- **`src/auth/`**: Auth features: JWT strategies, guards, controllers for login, signup, refresh and access token generation.  
- **`src/user/`**: User features
- **`main.ts`**: NestJs entry point

---

## Local Development Setup

### Prerequisites
- **Node.js v16+**  
- **npm** or **yarn**  
- **MongoDB** installed locally (or Docker-based)  
- **`.env`** file with environment variables (JWT secrets, etc.)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/easygenerator-backend.git
cd easygenerator-backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create a `.env` File if does not exist

In the project root:

```
PORT=3000
MONGO_URI=mongodb://mongodb:27017/easygeneratordb
JWT_ACCESS_EXPIRES=15s
JWT_REFRESH_EXPIRES=7d
JWT_ACCESS_SECRET=easygeneratorsecret
JWT_REFRESH_SECRET=easygeneratorrefreshsecret
```

Adjust as needed.
** Please modify the cors configuration in main.ts as required.

### 4. Run Locally [Recommended approach: docker compose up] (Development) [Check Mongo DB connection string if running without docker]

```bash
npm run start:dev
# or
yarn start:dev
```

NestJS dev server runs at `http://localhost:3000`.

### 5. View Swagger API Documentation

Once the server is running, open:

```
http://localhost:3000/api
```

This interactive documentation allows you to explore available endpoints and test them directly from the UI.

### 6. Production Build

```bash
npm run build
npm run start:prod
```

Compiles TypeScript into `dist/` and runs with Node in production mode.

---

## Docker & Docker Compose

If desired, you can run everything in Docker. Example:

```bash
docker-compose build
docker-compose up -d
```

This spins up MongoDB + Backend together. The backend will listen on port `3000`.

---

## Platform Requirements

- Node.js **v16+**
- npm or yarn
- MongoDB (local or Docker)
- Docker (optional, for containerized deployment)

---

## Contributing

1. **Fork** the repository  
2. **Create** a branch: `git checkout -b feature/my-feature`  
3. **Commit** changes: `git commit -m 'Add some feature'`  
4. **Push** to GitHub: `git push origin feature/my-feature`  
5. **Open** a Pull Request  

---

## License

[MIT](LICENSE) © 2025 ayushwritescode

