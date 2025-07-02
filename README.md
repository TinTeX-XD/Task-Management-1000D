# Jira-like Task Management System

A comprehensive task management web application built with Next.js, featuring project management, Kanban boards, team collaboration, and invoice generation.

## 🚀 Features

- **Authentication**: Firebase Auth with email/password login
- **Project Management**: Create, edit, and manage projects with client assignments
- **Kanban Board**: Drag-and-drop task management with status columns
- **Task Management**: Detailed task creation with assignees, priorities, and due dates
- **Team Collaboration**: Team member management and assignment
- **Client Management**: Client profiles and project associations
- **Invoice Generation**: Automated invoice creation based on project tasks
- **WhatsApp Integration**: Task notifications and updates via WhatsApp
- **GitHub Integration**: Link tasks to GitHub branches and commits
- **Responsive Design**: Modern UI with dark/light theme support
- **Real-time Updates**: Live task status updates and notifications

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Firebase Auth** for authentication
- **React DnD** for drag-and-drop functionality

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma ORM** with MySQL database
- **Firebase Admin SDK** for server-side auth
- **WhatsApp Business API** for notifications
- **Swagger** for API documentation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MySQL database
- Firebase project
- WhatsApp Business Account (optional)

## 🔧 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
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

Edit `.env.local` with your actual configuration values:

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication with Email/Password
4. Generate a new private key for Admin SDK
5. Copy the configuration values to your `.env.local`

#### Database Setup
1. Create a MySQL database
2. Update the `DATABASE_URL` in `.env.local`
3. Run database migrations:

\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

#### WhatsApp Business API (Optional)
1. Set up WhatsApp Business API through Meta
2. Get your access token and phone number ID
3. Configure webhook URL for receiving updates

### 4. Database Migration

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database with sample data (optional)
npx prisma db seed
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 API Documentation

Once the server is running, you can access the Swagger API documentation at:
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## 🏗️ Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── projects/          # Project management pages
│   ├── tasks/             # Task management pages
│   ├── invoices/          # Invoice generation pages
│   └── login/             # Authentication pages
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── contexts/             # React contexts
\`\`\`

## 🔐 Authentication

The application uses Firebase Authentication with the following features:
- Email/password login and registration
- Protected routes with middleware
- JWT token validation on API routes
- Persistent login state with local storage

## 📊 Database Schema

The application uses the following main entities:
- **Users**: User profiles and authentication
- **Projects**: Project information and client associations
- **Tasks**: Task details with status, priority, and assignments
- **Clients**: Client information and contact details
- **Invoices**: Generated invoices based on project work
- **WhatsApp Logs**: Message delivery tracking

## 🎨 UI Components

Built with shadcn/ui components including:
- Responsive sidebar navigation
- Kanban board with drag-and-drop
- Task detail drawer
- Project cards with status indicators
- Invoice generation forms
- Dark/light theme toggle

## 📱 WhatsApp Integration

Configure WhatsApp notifications for:
- Task assignments
- Status updates
- Project deadlines
- Invoice generation alerts

## 💰 Invoice Generation

Features include:
- Automatic invoice creation from project tasks
- Customizable invoice templates
- PDF export functionality
- Client billing information
- Time tracking integration

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

## 🔧 Configuration

### Firebase Configuration
- Enable Authentication with Email/Password provider
- Set up Firestore rules for data security
- Configure Firebase Admin SDK for server-side operations

### Database Configuration
- Ensure MySQL server is running
- Configure connection pooling for production
- Set up regular backups

### WhatsApp Configuration
- Verify webhook URL with Meta
- Configure message templates
- Set up proper error handling

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Authentication Error**
   - Verify API keys in `.env.local`
   - Check Firebase project configuration
   - Ensure authentication is enabled

2. **Database Connection Error**
   - Verify MySQL server is running
   - Check DATABASE_URL format
   - Ensure database exists

3. **WhatsApp Webhook Issues**
   - Verify webhook URL is accessible
   - Check verify token configuration
   - Review Meta Developer Console logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/api/docs`
- Review the troubleshooting section above

## 🔄 Updates

To update the application:

\`\`\`bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Update database schema
npx prisma db push

# Restart the application
npm run dev
