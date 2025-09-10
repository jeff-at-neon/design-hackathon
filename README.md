# Design Hackathon - React Frontend

A React application demonstrating Databricks Design System components with a playground interface, agents management, and typography showcase.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd design-hackathon
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── primary-lockup-full-color-rgb.svg
├── src/
│   ├── components/
│   │   ├── CustomSimpleSelect.jsx
│   │   └── CustomSimpleSelect.css
│   ├── AgentsPage.jsx
│   ├── AgentsPage.css
│   ├── App.js
│   ├── App.css
│   ├── Playground.jsx
│   ├── Playground.css
│   ├── PlaygroundDemo.js
│   ├── TypographyShowcase.jsx
│   ├── TypographyShowcase.css
│   ├── index.js
│   └── index.css
├── package.json
└── package-lock.json
```

## 🎯 Features

### Main Components

- **Playground** - Interactive AI chat interface with model selection
- **AgentsPage** - Agent management with filtering and search capabilities
- **TypographyShowcase** - Complete typography system demonstration
- **CustomSimpleSelect** - Custom dropdown component

### Key Features

- ✅ Databricks Design System integration
- ✅ Responsive design
- ✅ Interactive components
- ✅ Search and filtering
- ✅ Modern UI/UX patterns

## 🛠️ Available Scripts

In the `frontend` directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note: This is a one-way operation. Once you eject, you can't go back!**

## 🎨 Design System

This app uses the **Databricks Design System** (`@databricks/design-system`) which provides:

- Consistent UI components
- Typography system
- Color palette
- Icon library
- Accessibility features

## 🔧 Development

### Hot Reloading
The development server supports hot reloading. Changes to your code will automatically refresh the browser.

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, the app will prompt you to use a different port.

### Node Version Issues
Make sure you're using Node.js version 16 or higher:
```bash
node --version
```

### Dependency Issues
If you encounter dependency issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is part of a design hackathon and follows the repository's licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues, please refer to the project documentation or contact the development team.

---

**Happy coding!** 🎉
