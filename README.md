# AI Pictionary

https://github.com/user-attachments/assets/e245c86b-273a-4d16-adf8-76ecb5408e5f

## Introduction

AI Pictionary is an interactive application where players can enjoy a game of Pictionary powered by artificial intelligence. The project uses Python and requires setting up a virtual environment to run smoothly.

## How to Make Your Own Pictionary AI

Follow these steps to set up and run the application:

---

### 1. Clone the Repository

Run the following command in your terminal to clone the repository:

```bash
git clone https://github.com/Aishwary2004Gupta/AI-Pictionary.git
```

---

### 2. Set Up the Environment

#### If you are on **Mac**:
1. Create an `.env` file:
   ```bash
   touch .env
   ```
2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

#### If you are on **Windows**:
1. Create an `.env` file:
   ```bash
   new-item .env
   ```
2. Set up a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## Make sure to add your own OPENAI_API

#### app.py file
```bash                
  api_key = os.getenv("Your-OPENAI-API-KEY")
```

#### .env file
```bash                
  OPENAI_API_KEY = "your-api-key"
```

### 3. Run the Application

1. Start the Python server:
   ```bash
   python app.py
   ```
2. Open your HTML file by running it through a live server. For example, if you're using VS Code, you can right-click the HTML file and select "Open with Live Server."

---

## Features

- **Interactive Gameplay**: Engage in an AI-powered Pictionary game.
- **Customizable Setup**: Clone and modify the repository to create your own version.
- **Cross-Platform Compatibility**: Works on both Windows and Mac.

---

## Contributing

Feel free to fork the repository and submit a pull request with your improvements or new features!

---

# Don't forget to ⭐ this repo 
