# **App Name**: Claro SAA Mobile

## Core Features:

- User Authentication: Allow agents and supervisors to log in securely using email and password via Firebase Authentication.
- Bottom Navigation UI: Implement a fixed bottom navigation bar with 'Guide,' 'Offer Builder,' and 'Comparator' tabs for easy navigation.
- Quick Guide: Enable agents to search and access procedures, filtering by title and tags within the 'procedimentos' collection. Display procedures grouped by category using MUI Accordion.
- Offer Builder: Allow agents to view and add products from the 'produtos' collection to the current offer, filtering by type (Mobile, TV, etc.).
- Offer Comparator: Compare current expenses with the new Claro offer, calculating potential savings or increases, and display an argument of sale. The 'Argument of Sale' highlights savings in green, or increased expenses in red with additional benefits of the Claro offer.
- Admin Panel: Secure /admin route accessible only to users with 'supervisor' role, allowing CRUD operations for 'produtos' and 'procedimentos' collections.
- Role-Based Access Control: Redirect 'agente' users from the /admin route to the home page, ensuring only supervisors can access admin functionalities based on roles in the 'usuarios' collection.

## Style Guidelines:

- Primary color: Deep blue (#1A237E) to convey trust and stability, reflecting Claro's brand. This color is versatile and contrasts well with light backgrounds, ideal for a professional mobile-first interface.
- Background color: Light blue-gray (#E8EAF6) to ensure comfortable readability on mobile devices.
- Accent color: Soft lavender (#B39DDB), to ensure the display of contrast. The use of soft tones reflects digital design aesthetic and mobile platform UX patterns.
- Body and headline font: 'PT Sans' for a modern yet readable feel, suitable for both headings and body text, ensuring legibility on mobile devices. Its slightly humanist styling will enhance the user experience with subtle personality, avoiding overly plain machine-made typography. 
- Use Material-UI (MUI) icons for a consistent and mobile-friendly visual language. The chosen icons for navigation (Help/Search, Store/Portfolio, Calculator/Graph) align with the functionalities of each tab.
- Employ a mobile-first design approach with a fixed bottom navigation for easy access to main features. Use MUI components like Cards, ToggleButtons, and Accordions to optimize the layout for smaller screens.
- Implement subtle animations for state transitions (e.g., adding a product to the offer) to provide feedback and enhance user experience without overwhelming the mobile interface.