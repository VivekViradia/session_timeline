# Participant Session Timeline Visualization

This project is a React-based web application that visualizes participant activity in a meeting session. It displays a timeline for each participant, showing when they joined/left, when their microphone or webcam was active, and any errors that occurred during the session.

---

## Features

- Visual timeline for each participant in a meeting session
- Displays join/leave events, mic/webcam activity, and error events
- Interactive tooltips for event details
- Toggle to show/hide participant timelines
- Responsive and modern UI using Tailwind CSS and Radix UI components

---

## Approach & Structure

- **Data-driven rendering:** The timeline is generated dynamically from a JSON object representing the meeting and its participants.
- **Component-based UI:** The timeline and its elements are broken into reusable React components for clarity and maintainability.
- **Styling:** Tailwind CSS is used for rapid, responsive, and modern UI development.
- **Accessibility:** Radix UI primitives are used for accessible tooltips and UI elements.

**Main Structure:**
- `src/App.js`: Loads sample meeting data and renders the `SessionTimeline` component.
- `src/components/`: Contains all timeline and UI components.
- `src/lib/utils.js`: Utility functions (e.g., for class name merging).
- `tailwind.config.js`: Tailwind CSS configuration.

---

## Libraries Used

- **React**: For building user interfaces with reusable components.
- **Tailwind CSS**: Utility-first CSS framework for fast and responsive UI design.
- **Radix UI**: Accessible, unstyled UI primitives for tooltips and other UI elements.
- **clsx** or **classnames**: Utility for conditionally joining CSS class names.
- **date-fns** (if used): Modern JavaScript date utility library for formatting and manipulating dates.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository or download the source code.
2. Open a terminal in the project directory.
3. Install dependencies:

   ```sh
   npm install
   ```

### Running the App

Start the development server:

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

To create a production build:

```sh
npm run build
```

The optimized build will be output to the `build` folder.

---

## Customization

- To use your own session data, replace the `sampleData` object in `src/App.js`.
- UI components can be customized in the `src/components/` and `src/components/ui/` folders.
