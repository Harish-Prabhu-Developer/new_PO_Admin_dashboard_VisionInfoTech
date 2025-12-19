# Purchase Order Management System

A modern, responsive React application for managing purchase orders with real-time data visualization and comprehensive supplier management. Built with **Vite**, **Tailwind CSS**, and **Lucide React Icons**.

## 🎯 Project Overview

This is a **Purchase Order (PO) Management Dashboard** designed for enterprise-level supply chain operations. It provides an intuitive interface for viewing, managing, and tracking purchase orders with detailed item listings, supplier information, and financial summaries.

### Key Features
- ✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- ✅ **Modern UI** - Clean, professional interface with smooth transitions
- ✅ **Data Visualization** - Paginated tables with sorting and filtering capabilities
- ✅ **Supplier Management** - Comprehensive supplier information display
- ✅ **Order Summary** - Real-time financial calculations and status tracking
- ✅ **Tabbed Interface** - Multiple sections (Items, Logistics, Accounting, Attachments)
- ✅ **Interactive Components** - Modular, reusable React components
- ✅ **Accessibility** - WCAG-compliant with proper ARIA labels

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.x | UI library & component framework |
| **Vite** | Latest | Lightning-fast build tool & dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Lucide React** | Latest | Modern icon library |
| **JavaScript (ES6+)** | - | Application logic |

### Development Tools
- **Node.js** - Runtime environment
- **pnpm** - Fast & efficient package manager
- **ESLint** - Code quality & consistency
- **npm/pnpm scripts** - Build automation

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📦 Installation

### Prerequisites
- **Node.js** v16 or higher
- **pnpm** v7+ (or npm/yarn)

### Step 1: Clone or Navigate to Project
```bash
cd "D:\D refresh\sample"
```

### Step 2: Install Dependencies
Using **pnpm** (recommended):
```bash
pnpm install
```

Or using **npm**:
```bash
npm install
```

### Step 3: Install Additional Packages (if needed)
```bash
pnpm add lucide-react
pnpm add -D tailwindcss postcss autoprefixer
```

---

## 🚀 Getting Started

### Development Server
Start the development server with hot module replacement:
```bash
pnpm dev
```
or
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
Create an optimized production build:
```bash
pnpm build
```
or
```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build
Preview the production build locally:
```bash
pnpm preview
```

### Lint Code
Check and fix code quality:
```bash
pnpm lint
```

---

## 📁 Project Structure

```
sample/
├── src/
│   ├── components/
│   │   ├── DataTable.jsx          # Paginated table component
│   │   ├── RemarksCard.jsx        # Remarks display card
│   │   ├── SummaryCard.jsx        # Financial summary card
│   │   ├── SupplierInfo.jsx       # Supplier information section
│   │   └── Tabs.jsx               # Tab navigation component
│   ├── Layout/
│   │   └── layout.jsx             # Main layout wrapper
│   ├── pages/
│   │   └── examplepage.jsx        # PO management page
│   ├── assets/                    # Static assets
│   ├── App.jsx                    # App root component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── public/                        # Static files
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── eslint.config.js               # ESLint rules
└── README.md                      # This file
```

---

## 🎨 Component Architecture

### Layout Structure
```
<Layout>
  ├── header (SupplierInfo + Edit Button)
  ├── body
  │   ├── <Tabs /> (Items, Logistics, Accounting, Attachments)
  │   └── <DataTable /> (Paginated item list)
  └── footer
      ├── <RemarksCard /> (PO remarks)
      └── <SummaryCard /> (Financial summary)
</Layout>
```

### Key Components

#### DataTable.jsx
- Displays purchase order items in a responsive table
- **Features:**
  - Pagination (7 items per page)
  - Responsive column alignment
  - Custom cell rendering support
  - Previous/Next navigation

#### SupplierInfo.jsx
- Shows supplier details and PO metadata
- **Displays:**
  - Supplier name, code, contact
  - PO number, status, dates
  - Modern edit button with icon

#### Tabs.jsx
- Navigation between order sections
- **Responsive:** Mobile-optimized with horizontal scroll
- **Active state styling:** Blue underline for active tab

#### RemarksCard.jsx & SummaryCard.jsx
- Information display cards with shadow and padding
- Responsive grid layout on desktop

---

## 📊 Sample Data

The example page (`examplepage.jsx`) includes 15 sample purchase order items with the following fields:

```javascript
{
  id,                    // Unique identifier
  item_no,               // Item number (e.g., ITM-0001)
  description,           // Item description
  whse,                  // Warehouse code
  uom_code,              // Unit of measurement code
  uom_name,              // Unit of measurement name
  quantity,              // Order quantity
  unit_price,            // Price per unit
  qty_whse,              // Quantity in warehouse
  discount,              // Discount percentage
  tax_code,              // Tax code
  base_entry,            // Base entry number
  qc_remark,             // Quality control remarks
  price_after_discount,  // Calculated price after discount
  total                  // Total amount for line item
}
```

---

## 🎯 Features in Detail

### Responsive Design
- **Mobile (< 640px):** Single column, stacked layout, reduced font sizes
- **Tablet (640-1024px):** Medium spacing, readable font sizes
- **Desktop (> 1024px):** Full grid layout, optimal spacing

### Table Pagination
- Shows 7 items per page
- "Showing X to Y of Z entries" counter
- Previous/Next buttons with disabled state

### Modern Theme
- **Primary Color:** Blue (#2563eb)
- **Secondary Colors:** Slate grays for text hierarchy
- **Accent Color:** Cyan (#06b6d4)
- **Status Colors:** Green (success), Amber (warning), Red (error)

### Styling Features
- Smooth transitions (200ms)
- Subtle shadows for depth
- Rounded corners (4-16px)
- Consistent spacing scale

---

## 🔧 Configuration

### Vite Config (`vite.config.js`)
```javascript
import react from '@vitejs/plugin-react'
export default {
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
}
```

### Tailwind Config (`tailwind.config.js`)
- Extended color palette
- Custom spacing scale
- Shadow definitions
- Border radius presets

### PostCSS Config (`postcss.config.js`)
- Tailwind CSS processor
- Autoprefixer for vendor prefixes

---

## 💻 Development Workflow

### 1. Start Development Server
```bash
pnpm dev
```

### 2. Make Changes
- Edit files in `src/` directory
- Hot reload will auto-update the browser

### 3. Check Code Quality
```bash
pnpm lint
```

### 4. Build for Production
```bash
pnpm build
```

### 5. Test Production Build
```bash
pnpm preview
```

---

## 📝 Coding Standards

### Component Structure
```jsx
import React from "react";
import { Icon } from "lucide-react";

const ComponentName = ({ prop1, prop2 }) => {
  // State management
  // Event handlers
  
  return (
    <div className="responsive-classes">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### Naming Conventions
- **Components:** PascalCase (e.g., `DataTable.jsx`)
- **Files:** kebab-case or PascalCase matching component name
- **Variables:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **CSS Classes:** kebab-case

### Responsive Classes Pattern
```jsx
className="text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-3 md:px-4"
```

---

## 🚀 Performance Optimizations

- ✅ **Code Splitting:** Vite automatically chunks code
- ✅ **Lazy Loading:** React.lazy for route-based splitting
- ✅ **Tree Shaking:** Unused code removed in production
- ✅ **CSS Minification:** Tailwind purges unused styles
- ✅ **Fast Refresh:** HMR for instant feedback during development

---

## 🔍 Debugging & Troubleshooting

### Common Issues

**Issue:** Port 5173 already in use
```bash
# Change port in vite.config.js or use:
pnpm dev -- --port 3000
```

**Issue:** Tailwind classes not applying
- Ensure CSS is imported in `main.jsx`
- Clear node_modules and reinstall
- Rebuild Tailwind cache

**Issue:** Module not found errors
- Check file paths (case-sensitive)
- Ensure all imports use correct extensions
- Verify node_modules installation

---

## 📚 Dependencies Overview

### Production
- **react** - UI library
- **react-dom** - React for browsers
- **lucide-react** - Icon library

### Dev Dependencies
- **@vitejs/plugin-react** - Vite React support
- **tailwindcss** - CSS utility framework
- **autoprefixer** - CSS vendor prefixes
- **eslint** - Code linting

---

## 🤝 Contributing

### Setup Local Environment
1. Clone the repository
2. Run `pnpm install`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make changes and test
5. Submit a pull request

### Code Review Checklist
- [ ] Code passes linting
- [ ] Responsive design tested
- [ ] Components are reusable
- [ ] Props are documented
- [ ] No console errors/warnings

---

## 📄 License

This project is part of the Sample Dashboard series. All rights reserved.

---

## 📞 Support & Documentation

### Useful Links
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

### Getting Help
- Check existing issues and solutions
- Review component documentation in code comments
- Test in isolated components first
- Check browser console for errors

---

## 🎉 Quick Start Checklist

- [ ] Node.js v16+ installed
- [ ] Project cloned/extracted
- [ ] `pnpm install` completed
- [ ] `pnpm dev` running successfully
- [ ] Browser shows app at localhost:5173
- [ ] Hot reload working (edit a file, see changes instantly)
- [ ] No console errors

---

**Last Updated:** December 18, 2025  
**Status:** Active Development  
**Version:** 1.0.0
