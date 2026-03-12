# Frontend Structure Plan for rwanda-agri-hub

## 1. Routes
- **/home**: Main landing page showing key updates and data.
- **/login**: Authentication page where users can log in.
- **/dashboard**: Main interface for accessing various functionalities.
- **/profile**: User profile page for managing user information.
- **/admin**: Administrative panel for managing users and content.

## 2. Roles
- **Admin**: Full access to all routes, can manage users and content.
- **User**: Limited access to routes; can view and edit personal information.
- **Guest**: Can view non-sensitive routes but cannot access authenticated areas.

## 3. Components
- **Navbar**: Displays navigation links based on user roles.
- **Footer**: Static footer for all pages with contact information and links.
- **Sidebar**: Contains links specific to the user’s role (Admin/User).
- **HomePage**: Main component for the public landing page.
- **Dashboard**: Component containing data visualizations and key metrics for the user.

## 4. Data Fetching
- Use **REST API** for server communication. Fetch data on a per-component basis and utilize **context** to manage state across components.
- Consider **Axios** for making HTTP requests due to its simplicity and promise-based syntax.

## 5. Auth Options
- Utilize **JWT (JSON Web Tokens)** for maintaining user sessions. Users will receive a token upon logging in, which will be used for subsequent requests.
- Implement a local storage mechanism to store tokens temporarily before expiration.

## 6. Folder Structure
```
/rwanda-agri-hub
|-- /src
|   |-- /components
|   |   |-- Navbar.js
|   |   |-- Footer.js
|   |   |-- Dashboard.js
|   |   |-- HomePage.js
|   |-- /pages
|   |   |-- HomePage.js
|   |   |-- Login.js
|   |   |-- Dashboard.js
|   |-- /api
|   |   |-- api.js         // Axios instance configuration
|   |-- /context
|   |   |-- AuthContext.js  // Handles auth state
|   |-- App.js              // Main app file
|-- package.json
```

## 7. Page Plan
- **HomePage**: Brief overview of the project and latest news.
- **LoginPage**: Form for users to enter their credentials. Include validation for inputs.
- **Dashboard**: Overview of user data, metrics, and quick links to relevant actions.
- **ProfilePage**: Editable form for users to manage their personal information.

## 8. Decisions Needed
- Finalizing the role-based access control and permissions.
- Deciding whether to use **CSS Modules** or **Styled Components** for styling.
- Determining if any third-party libraries are needed for charts or data visualization (e.g., Chart.js or D3.js).


This plan outlines the key aspects of the frontend structure for the rwanda-agri-hub project, aiming for a clean, efficient, and user-friendly interface with clear navigation and role management.