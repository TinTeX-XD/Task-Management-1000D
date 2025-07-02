# 🚀 Jira-like Task Management System

A comprehensive project management system built with Next.js, Firebase, and modern web technologies. Features include task management, Kanban boards, invoice generation, team collaboration, and WhatsApp Business API integration.

## ✨ Features

- **🔐 Authentication**: Firebase Auth with email/password
- **📋 Project Management**: Create and manage projects with client associations
- **📝 Task Management**: Kanban board with drag-and-drop functionality
- **💰 Invoice Generator**: Create, manage, and export invoices as PDF
- **👥 Team Collaboration**: User roles and permissions
- **📱 WhatsApp Integration**: Automated notifications via WhatsApp Business API
- **🔗 GitHub Integration**: Link tasks to Git branches
- **🌙 Dark Mode**: Full dark/light theme support
- **📱 Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL/PostgreSQL
- **Authentication**: Firebase Auth
- **UI Components**: shadcn/ui
- **PDF Generation**: jsPDF
- **Drag & Drop**: @dnd-kit/core
- **Notifications**: WhatsApp Business API

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MySQL or PostgreSQL database
- Firebase project
- WhatsApp Business API access

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment setup**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables in `.env.local`:

4. **Database setup**
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   \`\`\`

5. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password
3. Get your Firebase config and add to `.env.local`
4. Generate a service account key for admin operations

### WhatsApp Business API Setup

1. Create a Meta Business account
2. Set up WhatsApp Business API
3. Get your access token and phone number ID
4. Add webhook URL for receiving messages
5. Configure environment variables

### Database Configuration

The system supports both MySQL and PostgreSQL. Update your `DATABASE_URL` in `.env.local`:

\`\`\`bash
# For MySQL
DATABASE_URL="mysql://username:password@localhost:3306/task_management"

# For PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
\`\`\`

## 📱 WhatsApp Integration

The system uses WhatsApp Business API to send notifications for:
- Task assignments
- Project updates
- Invoice reminders
- Deadline alerts

### Setting up WhatsApp Business API

1. **Create Meta Business Account**
   - Go to [Meta Business](https://business.facebook.com)
   - Create a business account

2. **Set up WhatsApp Business API**
   - Navigate to WhatsApp Business API
   - Add your phone number
   - Verify your business

3. **Get API Credentials**
   - Access Token
   - Phone Number ID
   - Webhook Verify Token

4. **Configure Webhook**
   - Set webhook URL to: `https://yourdomain.com/api/webhooks/whatsapp`
   - Add verify token from your environment variables

## 🏗️ Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── projects/          # Project management
│   ├── tasks/             # Task management
│   ├── invoices/          # Invoice generator
│   └── login/             # Authentication
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── contexts/             # React contexts
├── prisma/               # Database schema
└── public/               # Static assets
\`\`\`

## 🔐 Authentication & Authorization

The system implements role-based access control:

- **Admin**: Full system access
- **Project Manager**: Manage assigned projects
- **Team Member**: Access assigned tasks
- **Client**: View project progress

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Project Endpoints
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Task Endpoints
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Invoice Endpoints
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/[id]/pdf` - Generate PDF

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

2. **Set Environment Variables**
   Add all environment variables in Vercel dashboard

3. **Configure Database**
   Set up your production database and update `DATABASE_URL`

### Docker Deployment

\`\`\`bash
# Build the image
docker build -t task-management .

# Run the container
docker run -p 3000:3000 --env-file .env.local task-management
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/task-management-system/issues) page
2. Create a new issue with detailed information
3. Join our [Discord community](https://discord.gg/yourinvite)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Firebase](https://firebase.google.com/) for authentication and hosting
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Prisma](https://prisma.io/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
\`\`\`

Now let's create the complete Firebase configuration:
