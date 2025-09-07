#  Modern Admin Dashboard

## 📖 Description

This is a **web-based Modern Admin Dashboard** developed using **HTML, CSS, and jQuery**. It allows administrators to **manage users**, **handle posts**, **moderate comments**, and view key statistics by interacting with the live **JSONPlaceholder API**. The system is designed with a clean, responsive, and highly interactive user interface, providing a seamless user experience.

---

## ✨ Features

Based on the project's functionality, the system offers the following:

-   **Dashboard Overview**: View at-a-glance statistics for *total users, posts, and comments* on stylish, animated cards.
-   **User Management (CRUD)**: A complete set of tools to *Add, Edit, Delete, and View users* in an interactive table.
-   **Post Management (CRUD)**: Functionality to *Add, Edit, and Delete posts* displayed in a clean, grid-based layout.
-   **Comment Management**: Ability to *View and Delete comments* associated with any given post.
-   **Favorite System**: Mark users as favorites, with the selection saved locally using `localStorage` for persistence.
-   **Dark/Light Theme**: A beautiful theme toggle that saves the user's preference for future visits.
-   **Dynamic Search & Filtering**: A real-time search bar to instantly filter posts by their title or content.
-   **Responsive Design**: The entire layout is fully responsive and optimized for a great experience on all devices, from mobile to desktop.

---

##  Technologies & Libraries Used

-   **HTML5 & CSS3**: Core technologies for structure and modern styling.
-   **JavaScript (jQuery)**: Used for DOM manipulation, event handling, and API communication.
-   **jQuery DataTables**: A powerful plugin for creating interactive tables with *pagination, search, and sorting*.
-   **Toastr.js**: A library for generating simple, non-blocking *user notifications (toasts)*.
-   **Animate.css**: Used for creating smooth, attention-grabbing *entrance animations* on elements.
-   **Font Awesome**: The icon toolkit used for a *clean and consistent set of icons* throughout the application.
-   **Google Fonts**: The *Poppins* font family was used for modern and readable typography.

---
## ScreenShots 
<img width="1895" height="906" alt="image" src="https://github.com/user-attachments/assets/9c897cb1-0dcf-43aa-b7ef-f50a697ceef9" />
<img width="1894" height="908" alt="Screenshot 2025-09-07 175302" src="https://github.com/user-attachments/assets/825550eb-3729-4e94-a173-836c6fd7f79c" />
<img width="1916" height="910" alt="Screenshot 2025-09-07 175248" src="https://github.com/user-attachments/assets/f4576975-e7ed-4245-b16c-1e52b263dab9" />
<img width="1910" height="904" alt="Screenshot 2025-09-07 175234" src="https://github.com/user-attachments/assets/b1219a58-ccec-4177-a86b-6deed10c10fd" />



##  Setup and Installation

Since this is a front-end project, there is no complex build process. To set up and run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/modern-admin-dashboard.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd modern-admin-dashboard
    ```
3.  **Open the `index.html` file in your browser.**
    -   For the best experience, it is recommended to use a local server extension like **Live Server** in VS Code to prevent any browser security (CORS) issues with API requests.

---

## ▶️ Usage

1.  **Dashboard & Statistics** 
    -   Upon loading, you are greeted with key statistics on the main dashboard.
2.  **Managing Users & Posts** 
    -   Navigate to the "Users" or "Posts" section.
    -   Use the `Add` button to create new entries via a modal form.
    -   Use the `✏️ Edit` and `🗑️ Delete` icons on any item to modify or remove it.
3.  **Viewing Comments** 
    -   On the Posts page, click the `View Comments` button on any post to open a modal displaying its comments.
4.  **Toggling Theme** 
    -   Use the `🌙 Dark Mode` / `☀️ Light Mode` button in the sidebar to switch themes. Your choice will be saved for your next visit.
