# AI Rules for HealthManager Application

This document outlines the technical stack and specific library usage guidelines for the HealthManager application. These rules are designed to ensure consistency, maintainability, and adherence to best practices.

## Tech Stack Overview

*   **Frontend Framework**: React with TypeScript for robust and scalable user interfaces.
*   **Build Tool**: Vite for a fast development experience and optimized builds.
*   **Styling**: Tailwind CSS for a utility-first approach to responsive and consistent design.
*   **UI Components**: shadcn/ui, providing accessible and customizable components built on Radix UI.
*   **Routing**: React Router DOM for declarative client-side navigation.
*   **Data Management**: Tanstack React Query for efficient server state management, data fetching, and caching.
*   **Form Handling**: React Hook Form combined with Zod for powerful form validation and management.
*   **Icons**: Lucide React for a comprehensive and customizable icon set.
*   **Date Utilities**: date-fns and react-day-picker for date manipulation and selection.
*   **Notifications**: Sonner for elegant and accessible toast notifications.

## Library Usage Guidelines

To maintain a consistent and efficient codebase, please adhere to the following rules when implementing features:

*   **UI Components**: Always prioritize components from `shadcn/ui`. If a required component is not available or needs significant deviation from `shadcn/ui`'s design, create a new component in `src/components/` and style it using Tailwind CSS. Do not modify `shadcn/ui`'s core files directly.
*   **Styling**: All styling must be done using Tailwind CSS utility classes. Avoid inline styles or custom CSS files unless absolutely necessary for global styles (e.g., `src/index.css`).
*   **Routing**: Use `react-router-dom` for all application navigation. Route definitions should primarily reside in `src/App.tsx`.
*   **Data Fetching & Caching**: Utilize `Tanstack React Query` for all interactions with server-side data, including fetching, mutations, and caching.
*   **Forms & Validation**: Implement forms using `react-hook-form` for state management and `zod` for schema-based validation.
*   **Icons**: Use icons exclusively from the `lucide-react` library.
*   **Toast Notifications**: For displaying simple, non-blocking messages to the user, use `sonner`.
*   **Date Pickers**: When a date input is required, use the `react-day-picker` component.
*   **Responsiveness**: Ensure all new components and layouts are fully responsive across different screen sizes, leveraging Tailwind's responsive prefixes.
*   **File Structure**:
    *   New pages should be created in `src/pages/`.
    *   New components should be created in `src/components/`. Each component should reside in its own file.
    *   Custom React hooks should be placed in `src/hooks/`.
    *   General utility functions should be placed in `src/lib/` or `src/utils/`.