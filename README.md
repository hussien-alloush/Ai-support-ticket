# Ai-support-ticket

Setup — running both projects together

1-Clone the repo

git clone https://github.com/hussien-alloush/Ai-support-ticket.git
cd Ai-support-ticket

2. Backend

cd backend
npm install

Fill in .env:

PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-support-tickets
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-your-key-here
CLIENT_URL=http://localhost:5173

bashnpm run dev

You should see MongoDB connected successfully and Server running on port 5000 in the terminal.

3. Frontend

Open a second terminal (keep the backend running in the first one):

cd frontend
npm install
npm run dev

Vite will print the URL it's running on (usually
http://localhost:5173). This must match CLIENT_URL in the backend's
.env exactly, or every request will fail with a CORS error.

3. Try the full flow


Open the frontend URL, register two accounts: one as customer, one
as agent.
Log in as the customer, submit a ticket. Watch the AI's category,
priority, and reasoning appear right after submitting.
Log out, log in as the agent. The ticket appears in the list, already
sorted by the priority the AI assigned.
Open the ticket, click Use AI-suggested reply to load the draft AI
wrote, edit it if needed, and send it.



