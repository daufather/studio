# **App Name**: Port Authority

## Core Features:

- Login/Register: Secure user authentication with login and registration functionality.
- Gate Management: Manage gates with unique IDs, status (open/closed), and location. Ability to register new gates or edit status.
- Vehicle Management: Register vehicles with details (license plate, type, owner information) and track entry/exit history. Associate vehicles with authorized schedules.
- Schedule Management: Create and manage schedules for vehicle entry and exit, including vehicle ID, gate ID, date/time, and purpose.
- Access Control Logic: Automatic validation of vehicles against their schedule. Send a signal to open the gate if the vehicle matches an active schedule; otherwise, deny access and log the attempt.
- Email Reminder System: Send email reminders to vehicle owners about upcoming schedules. Configurable reminder time (e.g., 24h before scheduled entry).
- Admin Dashboard: Overview of gates, vehicles, schedules, and access logs with search and filter by vehicle, gate, or date. Role-based access control for administrators and operators.

## Style Guidelines:

- Primary color: Deep, professional navy blue (#2E3192) to evoke trust and authority, given the sensitive control applications.
- Background color: Light, desaturated blue-gray (#E8EAF6), similar in hue to the primary color but significantly lighter, to provide a neutral backdrop that enhances focus and legibility.
- Accent color: Energetic, contrasting yellow-orange (#FFC107) as a highlight color for calls to action and important interactive elements, for strong visibility against the darker background.
- Body font: 'Inter', sans-serif.
- Headline font: 'Space Grotesk', sans-serif.
- Use clear, concise icons for navigation and gate/vehicle status indicators.
- Prioritize a clean, dashboard-style layout for the admin interface.
- Subtle transitions and animations for gate status updates and data loading to provide feedback.