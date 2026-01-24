# **App Name**: Grillicious

## Core Features:

- Dynamic QR-Based Menu: Display a menu fetched from a local data source based on the table number extracted from the URL.
- Session Timer with Cart Reset: Implement a 15-minute countdown timer that clears the local cart and refreshes the page with a 'Session Expired' alert after inactivity.
- Order Placement: Allow customers to add items to a cart and place an order, saving order details (tableId, items, totalPrice, status, timestamp) to local storage . Total price displayed in INR.
- Real-Time Order Feed: Admin dashboard (/admin) displaying a live list of incoming orders.
- Order Management: Admin interface with cards showing order details (Table Number, items) and buttons to update order status (Preparing, Served, Completed).
- Location-Based Admin Login: Geofence-restricted admin login using the Geolocation API, allowing access only within 100 meters of a specified location.

## Style Guidelines:

- Primary color: Vibrant Yellow (#FACC15) as the background to create a bold and energetic atmosphere.
- Text color: Bold Black (#000000) for all typography to provide high contrast against the yellow background.
- Font: All typography should be bold.
- Implement a mobile-first responsive layout using Tailwind CSS for optimal viewing across devices.
- Menu cards should have a white background, black borders, and black text, with thick borders and hard shadows, sticking to the Neobrutalist aesthetic to ensure readability and contrast against the yellow background.