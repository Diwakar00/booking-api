
# Simple Setup

1. Clone the repository:
	 ```bash
	 git clone https://github.com/Diwakar00/booking-api.git
	 cd booking-api
	 ```

2. Install dependencies:
	 ```bash
	 npm install
	 ```

3. Start the development server:
	 ```bash
	 npm run start:dev
	 ```

App will be available at: http://localhost:3000

# Run with Docker Compose

## Detailed Docker Setup

1. **Install Docker Desktop**
	 - Download and install Docker Desktop from: https://www.docker.com/products/docker-desktop

2. **Project Structure Requirement**
	 - Your folder should look like this:
		 ```
		 project-root/
		 ├── booking-ui/      # Frontend repo
		 ├── booking-api/     # This repo (backend)
		 └── docker-compose.yml
		 ```
	 - Both `booking-ui` and `booking-api` folders must be in the same directory as `docker-compose.yml`.

3. **Copy Docker Compose File**
	 - Make sure the following code is saved in a file named `docker-compose.yml` in the root of your project:
	 ```yaml
	 services:
		 backend:
			 build:
				 context: ./booking-api
			 container_name: booking-backend
			 ports:
				 - "3000:3000"
			 volumes:
				 - ./booking-api:/app
				 - /app/node_modules
			 environment:
				 - NODE_ENV=development
			 command: npm run start:dev
			 restart: unless-stopped

		 frontend:
			 build:
				 context: ./booking-ui
			 container_name: booking-frontend
			 ports:
				 - "5173:5173"
			 volumes:
				 - ./booking-ui:/app
				 - /app/node_modules
			 environment:
				 - NODE_ENV=development
				 - VITE_API_URL=http://localhost:3000
			 command: npm run dev -- --host 0.0.0.0
			 depends_on:
				 - backend
			 restart: unless-stopped
	 ```

4. **Start the Services**
	 - Open a terminal in the project root (where `docker-compose.yml` is located).
	 - Run the following command:
	 ```bash
	 docker-compose up --build
	 ```

5. **Access the Applications**
	 - Frontend: http://localhost:5173
	 - Backend: http://localhost:3000

6. **Live/Hot Reload**
	 - Your local code is mounted into the containers for instant updates.
