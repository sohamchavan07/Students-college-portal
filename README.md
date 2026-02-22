# Students College Portal

A simple open-source portal for students to get college recommendations using AI and Supabase.

## Features
- College recommendation based on student profile
- AI-powered explanations using OpenAI
- Supabase backend for data storage

## Getting Started

### 1. Clone the Repository
```
git clone <repo-url>
cd Students-college-portal
```

### 2. Install Dependencies
```
npm install
```

### 3. Get Your API Keys

#### OpenAI API Key
- Sign up at [OpenAI](https://platform.openai.com/signup)
- Go to your account dashboard
- Create an API key
- Copy your API key

#### Supabase API Key
- Sign up at [Supabase](https://supabase.com/)
- Create a new project
- Go to Project Settings > API
- Copy your `anon` public key

### 4. Configure Environment Variables
Create a `.env` file in the root directory and add:
```
OPENAI_API_KEY=your-openai-api-key
SUPABASE_KEY=your-supabase-key
```

### 5. Start the Project
```
npm run dev
```

## Usage
- Fill out the student form
- Get recommended colleges and AI explanation

## License
MIT

## Contributing
Pull requests are welcome!