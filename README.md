ShopTech Application Setup & Run Instructions: 



GitHub : 

https://github.com/QasemYafeai/Shoptech

Youtube link :

https://www.youtube.com/watch?v=PcWxN2emfOs

# Overview
	ShopTech is a full-stack e-commerce application with a Node.js/Express backend and a Next.js frontend.
	Users can browse products, manage their cart, and complete orders with Stripe payment integration.


# Prerequisites
	• Node.js (v14 or higher)
	• npm
	• MongoDB (local or Atlas)


#Backend Setup
1. Create the Environment Variables:
In the root directory, create a file named .env (ensure this file is not tracked by version control). then paste this inside the .env file

add you api keys here 

MONGODB_URI=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=



# JWT Authentication
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=

SENDGRID_API_KEY=
EMAIL_FROM=
FRONTEND_URL=http://localhost:3000
JWT_SECRET=
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Frontend URL (for email links)

FRONTEND_URL=http://localhost:30002. 

# Install Dependencies:

npm install express mongoose cors dotenv jsonwebtoken bcryptjs nodemailer stripe @sendgrid/mail crypto


3. Run the Backend:

node server.js

The backend server will run at http://localhost:3001.

# Frontend Setup
1. Navigate to the Frontend Directory:

cd frontend

2. Install Dependencies:

npm install
3. Run the Frontend in Development Mode:

npm run dev


The frontend will run at http://localhost:3000.


Summary
1. Ensure Node.js, npm, and MongoDB are installed.
2. In the backend folder (root), set up your .env file with the required variables.
3. Run npm install in the root to install all backend dependencies.
4. Start the backend with node server.js.
5. Change to the frontend directory, run npm install to install frontend dependencies, then run npm
run dev.
