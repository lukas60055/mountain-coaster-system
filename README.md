## Mountain Coaster System - API

### Project Description

An API for managing mountain coasters and their assigned wagons. The system monitors the number of available wagons and staff, the clients being served, and allows managing coaster operations. Data is stored in JSON files, and Redis is used for distributed data management. The system operates autonomously without Redis, synchronizing data after reconnection.

### API Features

#### 1. Registering a New Mountain Coaster

- **Endpoint**: `POST /api/coasters`
- **Description**: Adds a new mountain coaster to the system, including staff count, daily client count, track length (in meters), and operating hours.
- **Sample Data**:
  ```json
  {
    "staffCount": 5,
    "clientCount": 150,
    "trackLength": 1800,
    "openHours": "08:00",
    "closeHours": "15:00"
  }
  ```

#### 2. Updating a Mountain Coaster

- **Endpoint**: `PUT /api/coasters/:coasterId`
- **Description**: Updates the details of an existing coaster. Track length cannot be changed.

#### 3. Registering a New Wagon

- **Endpoint**: `POST /api/coasters/:coasterId/wagons`
- **Description**: Adds a new wagon to the selected mountain coaster, specifying the number of seats and its speed (in meters per second).
- **Sample Data**:
  ```json
  {
    "seatCount": 15,
    "wagonSpeed": 1.2
  }
  ```

#### 4. Removing a Wagon

- **Endpoint**: `DELETE /api/coasters/:coasterId/wagons/:wagonId`
- **Description**: Removes the selected wagon from the specified mountain coaster.

---

### Data Storage

- Data is saved in the project directory under `data/[development|production]/coasters.json`.
- Synchronization with Redis occurs automatically upon reconnection. The system can function without Redis, saving and reading data from JSON files.

### Logging

- Logs are saved in the project directory under `logs/[development|production]`.
- Log types:
  - **Error**: `error.log` – logs related to errors (`console.error`).
  - **Warning**: `warn.log` – logs of warnings (`console.warn`).
  - **Info**: `info.log` – logs standard operations (`console.log`), but only in the development version.

---

### Managing Coasters and Wagons

1. **Operating Hours**: Each coaster has defined operating hours. Wagons must finish their rides before the coaster's closing time.
2. **Wagon Breaks**: After each completed trip, a wagon requires a 5-minute break before it can operate again.

### Managing Staff

1. Each coaster requires at least one staff member.
2. Each wagon requires an additional two staff members.
3. **Staff Shortage**: The system notifies if there is a staff shortage and calculates how many staff members are missing.
4. **Staff Surplus**: The system notifies if there is a surplus of staff and provides the number of extra workers.

### Managing Clients

1. The system monitors the number of clients that a coaster must serve each day.
2. **Insufficient Capacity**: If the coaster cannot serve all clients, the system notifies of missing wagons and staff.
3. **Excess Capacity**: If the coaster can serve more than twice the planned number of clients, the system notifies of excess resources.

### Statistics and Monitoring

1. System statistics are displayed every minute.
2. Statistics include the number of available coasters, wagons, staff, and clients.

---

### Running the Project

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start the Server**:

   - Development Mode:
     ```bash
     npm run dev
     ```
   - Production Mode:
     ```bash
     npm run start
     ```

3. **Redis Configuration**: The system also works without Redis, but after reconnection, the data will be synchronized.

---

### Author

**Łukasz Duda**
Website: [lukaspro.pl](https://lukaspro.pl/)
