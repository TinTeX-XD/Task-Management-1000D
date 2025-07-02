# 🚀 Jira-like Task Management System

A comprehensive project management and task tracking system built with Next.js 14, Firebase, and modern web technologies. Features include Kanban boards, invoice generation, team collaboration, and WhatsApp Business API integration.

![Task Management System](https://via.placeholder.com/800x400/0066cc/ffffff?text=Task+Management+System)

## ✨ Features

### 🔐 Authentication & Security
- Firebase Authentication with email/password
- Role-based access control (Admin, Manager, Member, Client)
- Protected routes and API endpoints
- JWT token validation
- Session management with automatic refresh

### 📋 Project & Task Management
- Create and manage multiple projects
- Kanban board with drag-and-drop functionality
- Task assignment with priority levels
- Due date tracking and notifications
- Task status management (To Do, In Progress, Review, Done)
- File attachments and comments
- Time tracking and logging

### 💰 Invoice Management
- Generate professional invoices from project data
- PDF export with custom branding
- Multiple invoice statuses (Draft, Sent, Paid, Overdue)
- Automatic invoice numbering
- Client billing information management
- Payment tracking and reminders

### 👥 Team Collaboration
- User management and role assignment
- Team member profiles and contact information
- Project-based team assignments
- Activity feeds and notifications
- Real-time updates and synchronization

### 📱 WhatsApp Business Integration
- Automated task assignment notifications
- Project update alerts
- Invoice payment reminders
- Deadline warnings
- Two-way communication via webhooks
- Template message support

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/Light theme support
- Modern component library (shadcn/ui)
- Intuitive navigation and search
- Loading states and error handling
- Toast notifications and alerts

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **React Hook Form** - Form handling and validation
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Beautiful icons

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **MySQL/PostgreSQL** - Relational database
- **Firebase Admin SDK** - Server-side Firebase operations

### Authentication & APIs
- **Firebase Auth** - User authentication
- **WhatsApp Business API** - Messaging integration
- **GitHub API** - Repository integration
- **Stripe API** - Payment processing (optional)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **TypeScript** - Static type checking

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **MySQL** or **PostgreSQL** database
- **Git** for version control

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Configuration

Copy the example environment file and configure your variables:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your actual configuration values. See the [Configuration Guide](#-configuration) below for detailed setup instructions.

### 4. Database Setup

Generate Prisma client and set up the database:

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database with sample data (optional)
npx prisma db seed
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## ⚙️ Configuration

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" and follow the setup wizard
   - Choose a project name and configure Google Analytics (optional)

2. **Enable Authentication**
   - Navigate to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Configure authorized domains if needed

3. **Get Configuration Keys**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon and copy the config object
   - Add these values to your `.env.local` file

4. **Set up Admin SDK**
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Download the JSON file and extract the required fields
   - Add `FIREBASE_ADMIN_*` variables to `.env.local`

### Database Configuration

#### MySQL Setup
\`\`\`bash
# Install MySQL (Ubuntu/Debian)
sudo apt update
sudo apt install mysql-server

# Create database
mysql -u root -p
CREATE DATABASE task_management;
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON task_management.* TO 'taskuser'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

#### PostgreSQL Setup
\`\`\`bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE task_management;
CREATE USER taskuser WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE task_management TO taskuser;
\`\`\`

Update your `DATABASE_URL` in `.env.local`:
\`\`\`bash
# For MySQL
DATABASE_URL="mysql://taskuser:your_password@localhost:3306/task_management"

# For PostgreSQL
DATABASE_URL="postgresql://taskuser:your_password@localhost:5432/task_management"
\`\`\`

### WhatsApp Business API Setup

1. **Create Meta Business Account**
   - Visit [Meta Business](https://business.facebook.com/)
   - Create a new business account or use existing one
   - Complete business verification process

2. **Set up WhatsApp Business API**
   - Go to [Meta Developers](https://developers.facebook.com/)
   - Create a new app and select "Business" type
   - Add WhatsApp product to your app
   - Follow the setup wizard

3. **Get API Credentials**
   - **Access Token**: From App Dashboard > WhatsApp > API Setup
   - **Phone Number ID**: From WhatsApp > API Setup > Phone numbers
   - **Business Account ID**: From App Dashboard > WhatsApp > Configuration

4. **Configure Webhook**
   - Set webhook URL: `https://yourdomain.com/api/webhooks/whatsapp`
   - Add verify token (create a random string)
   - Subscribe to message events

5. **Add to Environment Variables**
   \`\`\`bash
   WHATSAPP_ACCESS_TOKEN=your_access_token
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
   WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
   \`\`\`

## 🏗️ Project Structure

\`\`\`
task-management-system/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── projects/             # Project management APIs
│   │   ├── tasks/                # Task management APIs
│   │   ├── invoices/             # Invoice generation APIs
│   │   └── webhooks/             # Webhook handlers
│   ├── dashboard/                # Dashboard pages
│   ├── projects/                 # Project management pages
│   ├── tasks/                    # Task management pages
│   ├── invoices/                 # Invoice management pages
│   ├── team/                     # Team management pages
│   ├── clients/                  # Client management pages
│   ├── settings/                 # Settings pages
│   ├── login/                    # Authentication pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   ├── forms/                    # Form components
│   ├── charts/                   # Chart components
│   └── features/                 # Feature-specific components
├── lib/                          # Utility functions
│   ├── firebase.ts               # Firebase client config
│   ├── firebase-admin.ts         # Firebase admin config
│   ├── db.ts                     # Database connection
│   ├── whatsapp.ts               # WhatsApp API client
│   ├── utils.ts                  # General utilities
│   └── validations.ts            # Form validations
├── hooks/                        # Custom React hooks
├── contexts/                     # React contexts
├── types/                        # TypeScript type definitions
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding
├── public/                       # Static assets
├── styles/                       # Additional styles
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
\`\`\`

## 📱 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "member"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "member"
  },
  "token": "jwt_token"
}
\`\`\`

#### POST `/api/auth/login`
Authenticate user and get access token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword"
}
\`\`\`

### Project Management Endpoints

#### GET `/api/projects`
Get all projects for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `search` (optional): Search term for project names

#### POST `/api/projects`
Create a new project.

**Request Body:**
\`\`\`json
{
  "name": "Project Name",
  "description": "Project description",
  "clientId": "client_id",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "status": "active"
}
\`\`\`

### Task Management Endpoints

#### GET `/api/tasks`
Get tasks with filtering options.

**Query Parameters:**
- `projectId` (optional): Filter by project
- `assigneeId` (optional): Filter by assignee
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority

#### POST `/api/tasks`
Create a new task.

**Request Body:**
\`\`\`json
{
  "title": "Task Title",
  "description": "Task description",
  "projectId": "project_id",
  "assigneeId": "user_id",
  "priority": "high",
  "dueDate": "2024-01-15",
  "status": "todo"
}
\`\`\`

### Invoice Endpoints

#### GET `/api/invoices`
Get all invoices.

#### POST `/api/invoices`
Create a new invoice.

#### GET `/api/invoices/[id]/pdf`
Generate and download invoice PDF.

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Prepare for Deployment**
   \`\`\`bash
   npm run build
   npm run start # Test production build locally
   \`\`\`

2. **Deploy to Vercel**
   \`\`\`bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel

   # Follow the prompts to configure your project
   \`\`\`

3. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from `.env.local`
   - Redeploy the application

4. **Set up Database**
   - Use a cloud database service (PlanetScale, Railway, Supabase)
   - Update `DATABASE_URL` in Vercel environment variables
   - Run database migrations

### Docker Deployment

1. **Create Dockerfile**
   \`\`\`dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   \`\`\`

2. **Build and Run**
   \`\`\`bash
   # Build the image
   docker build -t task-management .
   
   # Run the container
   docker run -p 3000:3000 --env-file .env.local task-management
   \`\`\`

### Manual Server Deployment

1. **Prepare Server**
   \`\`\`bash
   # Install Node.js and PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   \`\`\`

2. **Deploy Application**
   \`\`\`bash
   # Clone repository
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
   
   # Install dependencies and build
   npm install
   npm run build
   
   # Start with PM2
   pm2 start npm --name "task-management" -- start
   pm2 save
   pm2 startup
   \`\`\`

## 🧪 Testing

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
\`\`\`

### Test Structure

\`\`\`
tests/
├── __mocks__/           # Mock files
├── components/          # Component tests
├── pages/              # Page tests
├── api/                # API route tests
├── utils/              # Utility function tests
└── e2e/                # End-to-end tests
\`\`\`

## 🔧 Development

### Available Scripts

\`\`\`bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # Run TypeScript checks

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:e2e        # Run E2E tests
\`\`\`

### Code Style and Formatting

The project uses ESLint and Prettier for code quality and formatting:

\`\`\`bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix

# Format code with Prettier
npm run format
\`\`\`

### Git Hooks

Pre-commit hooks are set up with Husky to ensure code quality:

- **pre-commit**: Runs linting and type checking
- **commit-msg**: Validates commit message format
- **pre-push**: Runs tests before pushing

## 🤝 Contributing

We welcome contributions to improve the Task Management System! Here's how you can contribute:

### Getting Started

1. **Fork the Repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally

2. **Set up Development Environment**
   \`\`\`bash
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
   npm install
   cp .env.example .env.local
   # Configure your environment variables
   npm run dev
   \`\`\`

3. **Create a Feature Branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`

### Making Changes

1. **Follow Code Standards**
   - Use TypeScript for type safety
   - Follow the existing code style
   - Write meaningful commit messages
   - Add tests for new features

2. **Test Your Changes**
   \`\`\`bash
   npm run test
   npm run lint
   npm run type-check
   \`\`\`

3. **Commit Your Changes**
   \`\`\`bash
   git add .
   git commit -m "feat: add amazing feature"
   \`\`\`

4. **Push and Create Pull Request**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`

### Pull Request Guidelines

- **Clear Description**: Explain what your PR does and why
- **Screenshots**: Include screenshots for UI changes
- **Tests**: Ensure all tests pass
- **Documentation**: Update documentation if needed
- **Small PRs**: Keep pull requests focused and small

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

\`\`\`
MIT License

Copyright (c) 2024 Task Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

## 🆘 Support & Help

### Getting Help

If you encounter issues or have questions:

1. **Check Documentation**: Review this README and inline code comments
2. **Search Issues**: Look through [existing issues](https://github.com/yourusername/task-management-system/issues)
3. **Create New Issue**: If you can't find a solution, create a detailed issue
4. **Join Community**: Connect with other users and contributors

### Common Issues

#### Firebase Authentication Error
\`\`\`
Error: Firebase configuration is invalid
\`\`\`
**Solution**: Verify all Firebase environment variables are correctly set in `.env.local`

#### Database Connection Error
\`\`\`
Error: Can't reach database server
\`\`\`
**Solution**: 
- Ensure database server is running
- Check `DATABASE_URL` format
- Verify database credentials

#### WhatsApp API Error
\`\`\`
Error: WhatsApp webhook verification failed
\`\`\`
**Solution**:
- Verify webhook URL is accessible
- Check `WHATSAPP_WEBHOOK_VERIFY_TOKEN` matches Meta configuration
- Ensure HTTPS is used in production

#### Build Error
\`\`\`
Error: Module not found
\`\`\`
**Solution**:
- Run `npm install` to ensure all dependencies are installed
- Clear Next.js cache: `rm -rf .next`
- Restart development server

### Performance Tips

1. **Database Optimization**
   - Use database indexes for frequently queried fields
   - Implement pagination for large datasets
   - Use database connection pooling

2. **Frontend Optimization**
   - Implement lazy loading for components
   - Use React.memo for expensive components
   - Optimize images with Next.js Image component

3. **API Optimization**
   - Implement caching for frequently accessed data
   - Use database transactions for related operations
   - Implement rate limiting for API endpoints

## 🙏 Acknowledgments

Special thanks to the following projects and communities:

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service platform
- **[Prisma](https://prisma.io/)** - Next-generation ORM for Node.js and TypeScript
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide](https://lucide.dev/)** - Beautiful & consistent icon toolkit
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms library
- **[WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)** - Business messaging platform

### Contributors

Thanks to all the contributors who have helped make this project better:

- [Your Name](https://github.com/yourusername) - Project Creator & Maintainer
- [Contributor 1](https://github.com/contributor1) - Feature Development
- [Contributor 2](https://github.com/contributor2) - Bug Fixes & Testing

---

<div align="center">

**Made with ❤️ by the Task Management System Team**

[⭐ Star this project](https://github.com/yourusername/task-management-system) | [🐛 Report Bug](https://github.com/yourusername/task-management-system/issues) | [💡 Request Feature](https://github.com/yourusername/task-management-system/issues)

</div>
\`\`\`

Now let me create the complete Firebase configuration files:
