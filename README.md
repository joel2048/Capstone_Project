# Japanese Vocabulary Flashcards

## Project Description
This is a React + Node.js application designed to help users create and manage vocabulary flashcards. Users can create custom collections of words, review them using the flashcard swipe function, and track their progress over time (work in progress). The app uses Auth0 for authentication, ensuring secure and personalized learning experiences. The backend is powered by Node.js with Sequelize ORM for database management.

---

## Features
- User authentication with Auth0
- Look up words
- Create, edit, and delete word-collections
- Automatically create flashcards
- API endpoints protected with JWT tokens
- Track progress and review history per user (in progress)

---

## How to use

### Backend Setup
1. **Create SQL schema**  
   Ensure you have a running SQL database (Postgres, MySQL, etc.) and create the schema for VocabApp.

2. **Fill in config.json**  
   schema name and password

3. **Install dependencies**  
   ```bash
   npm install

4. **run migrations**  
   ```bash
   npx sequelize-cli db:migrate
   
5. **Seed the database**  
   ```bash
   npx sequelize-cli db:seed:all

6. **Start the backend server**  
   ```bash
   npm start

will run on http://localhost:3000 by default

### Front-End Setup

1. **Install dependencies**  
   ```bash
   npm install

2. **Start the development server**  
   ```bash
   npm run dev

will run on http://localhost:5173
