<div align="center">
  <h1>🔗 Short-ifyy</h1>
  <p><strong>A Fast URL Shortener with Clean Analytics Dashboard</strong></p>

  <a href="https://short-ifyy.netlify.app/">
    <img src="https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify" />
  </a>
  <a href="https://render.com/">
    <img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render" />
  </a>
</div>

---

## 🚀 Overview

**Short-ifyy** is a full-stack URL shortening application that converts long URLs into short, manageable links and provides basic analytics on link usage.

The project focuses on **clean backend design, secure authentication, and practical full-stack integration**.

---

## ✨ Key Features

### 🔐 Authentication
- JWT-based authentication
- Login & registration flow
- Secure API access using tokens

### 🔗 URL Management
- Create short URLs from long links
- Store and retrieve user-specific URLs
- Simple dashboard to manage links

### 📊 Analytics
- Track number of clicks per URL
- View link performance from dashboard
- Structured to allow future analytics expansion

### ⚡ Performance
- Fast redirection using Spring Boot
- Efficient database interaction with JPA
- Lightweight frontend powered by Vite

### 🎯 User Interface
- Clean and minimal dashboard
- Responsive design for multiple screen sizes
- Simple user flow: Create → Copy → Track

---

## 🧠 What This Project Demonstrates

- Building REST APIs with Spring Boot
- Implementing authentication using JWT
- Managing relational data with PostgreSQL
- Connecting frontend and backend in a real project
- Structuring a project in a scalable and maintainable way

---

## 📸 Screenshots

<p align="center">
  <img src="assets/capture_20260421001905695.bmp" width="800" alt="Dashboard View"/>
  <br/><br/>
  <img src="assets/capture_20260421001935949.bmp" width="800" alt="Link Management"/>
  <br/><br/>
  <img src="assets/capture_20260421002032130.bmp" width="800" alt="Analytics Overview"/>
  <br/><br/>
  <img src="assets/capture_20260421002107488.bmp" width="800" alt="Login Screen"/>
  <br/><br/>
  <img src="assets/capture_20260421002136506.bmp" width="800" alt="Registration Screen"/>
</p>

---

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- CSS / UI Components
- Netlify (Deployment)

### Backend
- Spring Boot (Java 17)
- Spring Security + JWT
- Hibernate / JPA
- PostgreSQL (Neon DB)
- Render (Deployment)

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- Java JDK (17+)
- Maven
- PostgreSQL

---

### 1. Clone Repository
```bash
git clone https://github.com/benpointdex/Url-Shortener.git
cd Url-Shortener
```

---

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
```

Update `.env` with your:
- Database credentials
- JWT secret

Run backend:
```bash
./mvnw spring-boot:run
```

Backend runs on:
```
http://localhost:8090
```

---

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🤝 Contributing

Contributions are welcome:
1. Fork the repo
2. Create a new branch
3. Submit a pull request

---

## 📄 License

Licensed under the MIT License.
