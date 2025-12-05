# APM Roster 2.0

A beautiful, modern frontend application for browsing the Google APM (Associate Product Manager) directory.

## Features

✨ **Beautiful UI** - Modern, elegant design with smooth animations and gradients
🔍 **Smart Search** - Search across names, roles, companies, locations, and education
🎯 **Advanced Filters** - Filter by status (Still Here, Left, Boomerang) and class year
📊 **Live Statistics** - Real-time stats showing total APMs and retention
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
🎨 **Status Indicators** - Color-coded badges for employment status
🚀 **Performance** - Lazy loading with "Load More" for handling 900+ profiles
💼 **Rich Profiles** - Displays photos, current role, location, education, and experience

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Data Structure

The application reads from `merged_roster.json` which contains APM data including:

- Basic info (name, email, class year)
- Employment status (1 = Still Here, 2 = Left, 3 = Boomerang)
- LinkedIn profile data (photo, headline, location, experience, education)
- Current role and company information

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme.

### Status Mapping

Modify the `STATUS_MAP` object in `src/App.jsx` to change status labels and colors.

### Cards per Load

Change the initial `displayedCount` value in `src/App.jsx` to adjust pagination.

## Future Enhancements (P1 & P2)

- [ ] LLM-based semantic search ("Show me someone who worked at Tesla before Google")
- [ ] Integration with who/story API for internal Google employment history
- [ ] Internal APM forum/discussion board
- [ ] Featured person of the day
- [ ] Export and sharing capabilities
- [ ] Advanced analytics and insights

## Notes

This tool is designed for internal Google use only. Alumni who have left Google may lose access to update their profiles.

---

Built with ❤️ for the Google APM community


