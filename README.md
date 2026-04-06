# 🌌 Virtual Cosmos - Real-Time Proximity Chat

**Virtual Cosmos** is a 2D virtual environment built to simulate real-world social physics in a digital space. Users can move around as avatars and interact in real time. The project features a dynamic proximity-based chat system where users automatically connect when they come close and disconnect when they move apart.

---

## 📸 Project Screenshots

### 1. The Cosmos Environment

<img width="1450" height="686" alt="image" src="https://github.com/user-attachments/assets/f02241fe-b1d8-45c2-b22f-89776f4f0597" />

*A high-performance 2D space where multiple users can navigate as avatars simultaneously.*

### 2. Real-Time Proximity Chat

<img width="1455" height="682" alt="image" src="https://github.com/user-attachments/assets/12e65e2e-de19-464b-af7e-37d4c56897d0" />
<img width="1463" height="684" alt="image" src="https://github.com/user-attachments/assets/ddfb5c7d-786a-4ae7-951f-abffdca13fba" />



*Automatic chat panel trigger when two users enter the proximity radius.*


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

```

⚙️ Setup & Installation
1. Clone the Repository 
    git clone (https://github.com/Gauriigupta/Virtual-CosmosRealTimeProximityChat)
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
