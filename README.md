# 🌌 Virtual Cosmos - Real-Time Proximity Chat

**Virtual Cosmos** is a 2D virtual environment built to simulate real-world social physics in a digital space. Users can move around as avatars and interact in real time. The project features a dynamic proximity-based chat system where users automatically connect when they come close and disconnect when they move apart.

---

## 📸 Project Screenshots

### 1. The Cosmos Environment
![Cosmos View](image.png)
<img width="397" height="181" alt="image" src="https://github.com/user-attachments/assets/ed45d456-83a0-4050-a687-7e9c424f8f27" />

*A high-performance 2D space where multiple users can navigate as avatars simultaneously.*

### 2. Real-Time Proximity Chat
![Proximity Chat](image-1.png) (![alt text](image-2.png))
*Automatic chat panel trigger when two users enter the proximity radius.*

### 3. User Identity & Movement
![Movement and Name Tags](image-6.png)
*Custom avatars with dynamic name tags and smooth WASD/Arrow key movement.*

---

## 🚀 Key Features

* **2D Canvas Rendering**: High-performance environment rendered using **PixiJS** to ensure smooth 60 FPS movement.
* **Real-Time Multiplayer**: Multiple users are visible on the screen simultaneously, with positions synced instantly via **Socket.io**.
* **Proximity Detection Engine**: 
    * **Auto-Connect**: Chat panel appears and users join a shared room when distance < radius.
    * **Auto-Disconnect**: Chat is disabled and users leave the room when they move apart.
    * **Hysteresis Logic**: Implemented a dual-radius buffer to prevent UI flickering on the boundary.
* **Data Persistence**: Integrated with **MongoDB Atlas** to track `userId` and `position (x, y)` even after a page refresh.
* **Intuitive UI**: A clean, minimal interface built with **Tailwind CSS**.
* **Typing Safety**: Movement keys are automatically disabled when the user is typing to prevent accidental disconnection.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), PixiJS, Tailwind CSS |
| **Backend** | Node.js (Express), Socket.io |
| **Database** | MongoDB Atlas (User State & Session Storage) |

---

## 🔄 System Workflow

1. **Join**: User opens the app and enters the cosmos.
2. **Explore**: User sees other players moving in real time via WASD/Arrows.
3. **Connect**: Moving closer to another user establishes a connection and triggers the chat panel.
4. **Chat**: Users exchange messages in a private, proximity-locked room.
5. **Leave**: Moving away terminates the connection and hides the chat panel.

---

## 📂 Project Structure

```text
├── client/                # React + PixiJS Frontend
│   ├── src/
│   │   ├── components/    # CosmosCanvas, ChatPanel
│   │   ├── App.jsx        # Main UI Layout
│   │   └── socket.js      # Client-side Socket configuration
├── server/                # Node.js Backend
│   ├── config/            # Database connection
│   ├── controllers/       # User state logic
│   └── index.js           # Express & Socket.io Server
└── README.md


⚙️ Setup & Installation
1. Clone the Repository 
    git clone [https://github.com/Durgesh1008/virtual-cosmos.git]
    cd virtual-cosmos
2. Backend Setup

    cd server
    npm install
# Ensure your MongoDB URI is configured in config/db.js
    npm start
3. Frontend Setup

    cd client
    npm install
    npm run dev
