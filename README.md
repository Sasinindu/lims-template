# Control Union Lab - Laboratory Management System

A modern and creative Laboratory Management System (LIMS) web application built with React, Vite, and Tailwind CSS.

## Features

### 🎨 Modern UI/UX
- **Light & Dark Theme Support** - Seamless theme switching with persistent preferences
- **Glassmorphism Design** - Modern glass-like effects and smooth animations
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile devices
- **Framer Motion Animations** - Smooth transitions and micro-interactions

### 🔐 Authentication
- **Login Page** - Clean, professional login interface with Control Union branding
- **Form Validation** - Email and password validation with visual feedback
- **Remember Me** - Persistent login sessions
- **Forgot Password** - Password recovery functionality (UI ready)

### 📊 Dashboard
- **Real-time Statistics** - Key metrics and KPIs at a glance
- **Recent Activity** - Latest test results and system activities
- **Quick Actions** - Fast access to common tasks
- **Interactive Charts** - Data visualization placeholders ready for integration

### 🧪 Lab Management
- **Test Management** - Create, view, and track laboratory tests
- **Status Tracking** - Real-time status updates (Pending, In Progress, Completed)
- **Search & Filter** - Advanced filtering and search capabilities
- **Bulk Operations** - Export and batch processing features

### 📈 Reports & Analytics
- **Report Generation** - Automated report creation and scheduling
- **Data Export** - Multiple format support (PDF, Excel, CSV)
- **Analytics Dashboard** - Performance metrics and trends
- **Custom Reports** - Configurable report templates

### 👥 User Management
- **Role-based Access** - Different permission levels (Lab Director, Technician, etc.)
- **User Profiles** - Complete user information and contact details
- **Activity Tracking** - User actions and system usage monitoring
- **Security Settings** - Password policies and two-factor authentication

### ⚙️ System Settings
- **General Configuration** - Lab name, timezone, date formats
- **Notification Preferences** - Email and system alert settings
- **Security Policies** - Session management and access controls
- **Data Management** - Backup schedules and retention policies

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite (latest)
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React (modern, consistent icon library)
- **Animations**: Framer Motion for smooth transitions
- **Routing**: React Router DOM
- **Theme**: Custom theme provider with localStorage persistence

## Design System

### Colors
- **Primary**: #009ceb (Control Union Blue)
- **Light Theme**: Clean whites and grays with subtle shadows
- **Dark Theme**: Deep grays with proper contrast ratios
- **Status Colors**: Green (success), Yellow (warning), Red (error), Blue (info)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately across devices

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Primary, secondary, and ghost variants
- **Forms**: Consistent styling with focus states
- **Tables**: Responsive with hover states and actions

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LIMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Collapsible sidebar navigation
│   └── Layout.tsx      # Main layout wrapper
├── pages/              # Page components
│   ├── LoginPage.tsx   # Authentication page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── LabTests.tsx    # Test management
│   ├── Reports.tsx     # Reports and analytics
│   ├── Users.tsx       # User management
│   └── Settings.tsx    # System configuration
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management
├── types/              # TypeScript type definitions
├── assets/             # Static assets
└── main.tsx           # Application entry point
```

## Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  primary: {
    600: '#009ceb', // Your primary color
    // ... other shades
  }
}
```

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update the sidebar navigation in `src/components/Sidebar.tsx`

### Styling Components
Use the predefined Tailwind classes or create custom ones in `src/index.css`:

```css
@layer components {
  .your-custom-class {
    @apply bg-white dark:bg-gray-800 rounded-lg;
  }
}
```

## Features Ready for Integration

- **API Integration**: All components are ready for backend API connections
- **State Management**: Can easily integrate Redux, Zustand, or React Query
- **Authentication**: Ready for JWT, OAuth, or other auth providers
- **Database**: Prepared for any database backend (PostgreSQL, MongoDB, etc.)
- **Real-time Updates**: WebSocket integration ready
- **File Upload**: Drag-and-drop file handling prepared
- **Charts**: Chart.js or D3.js integration points identified

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Control Union Lab** - Modern Laboratory Management Made Simple
