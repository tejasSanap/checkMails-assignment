## overview
This project is a web application designed for MagicSlides.app as part of the Full-Stack Engineer Intern assignment. The application enables users to log in using Google OAuth, fetch their last X emails from Gmail, and classify them into different categories using OpenAI GPT-4.

## features
- User Authentication: Log in using Google OAuth.
- Email Fetching: Retrieve the user’s last X emails from Gmail (X = 15 by default).
- Email Classification: Classify emails into categories such as Important, Promotions, Social, Marketing, and Spam using OpenAI GPT-4.
- Local Storage: Store OpenAI API key and fetched emails in localStorage.

## Technologies Used
- Frontend: Next.js, Tailwind CSS, shadcnUI
- Backend: API routes in Next.js
- Authentication: Google OAuth
- APIs: Gmail API, OpenAI GPT-4

## Setup and Installation
Clone the repo
```bash
[git clone https://github.com/your-username/magicslides-app.git](https://github.com/tejasSanap/checkMails-assignment.git)
cd checkMails-assignment
```
Install Dependencies
```bash
npm install
# or
yarn install
```
Environment Variables
Create a .env.local file in the root directory and add the following environment variables:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## google oauth setup

Create Google Credentials:

1 Go to Google Cloud Console.
  - Navigate to the Credentials tab.
  - Click Create Credentials and select OAuth 2.0 Client IDs.
  - Choose Web application as the application type.
2 Configure Authorized JavaScript Origins and Redirect URIs:
  - Under Authorized JavaScript origins, add:
    - http://localhost:3000 (for local development)
    - Your deployed URL (e.g., https://your-deployed-url.com)
  - Under Authorized redirect URIs, add:
    - http://localhost:3000/api/auth/callback/google (for local development)
    - Your deployed URL's callback endpoint (e.g., https://your-deployed-url.com/api/auth/callback/google)

3 Enable Required APIs:

  - Go to the Library section in the Google Cloud Console.
  - Enable Google+ API and Gmail API.

4.Configure OAuth Consent Screen:

  - Navigate to the OAuth consent screen tab in the Google Cloud Console.
  - Add a test email address to the Test users section to allow login without verification.

5. Set Environment Variables:
   - Replace your-google-client-id and your-google-client-secret with your actual credentials.

## OpenAI API Setup

To use OpenAI GPT-4 for email classification, follow these steps:

1. **Create an OpenAI Account**:
   - If you don't already have an OpenAI account, sign up at [OpenAI](https://www.openai.com/).

2. **Generate an API Key**:
   - After logging in, go to the [OpenAI API Keys page](https://platform.openai.com/account/api-keys).
   - Click **Create API Key** to generate a new API key.
   - Copy the generated API key.
   - 
3. **Add API Key to the Application**:
   - Open your application and navigate to the home page.
   - You will see an input field to paste your OpenAI API key. 
   - Paste the API key into this field and click **Continue** to proceed to the email check page.

4. **Add API Key to Environment Variables (Optional)**:
   - For development purposes, you can also add the API key to your `.env.local` file:
     ```
     OPENAI_API_KEY=your-openai-api-key
     ```
     Replace `your-openai-api-key` with the API key you copied.


