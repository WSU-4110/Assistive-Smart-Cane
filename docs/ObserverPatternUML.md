# Observer Pattern UML Diagram

```mermaid
classDiagram
    class DeviceStatusSubject {
        <<interface>>
        +attach(observer: DeviceStatusObserver): void
        +detach(observer: DeviceStatusObserver): void
        +notify(): void
    }

    class DeviceStatusObserver {
        <<interface>>
        +update(status: DeviceStatus): void
    }

    class DeviceStatus {
        +batteryLevel: number
        +signalStrength: number
        +temperature: number
        +isConnected: boolean
    }

    class DeviceStatusManager {
        -static instance: DeviceStatusManager
        -observers: DeviceStatusObserver[]
        -status: DeviceStatus
        +static getInstance(): DeviceStatusManager
        +attach(observer: DeviceStatusObserver): void
        +detach(observer: DeviceStatusObserver): void
        +notify(): void
        +getStatus(): DeviceStatus
        +updateConnectionStatus(isConnected: boolean): void
        -startStatusUpdates(): void
    }

    class CaneStatusCard {
        -deviceStatus: DeviceStatus
        +useEffect(): void
        +update(status: DeviceStatus): void
        +render(): JSX.Element
    }

    class ConnectionCard {
        -isConnected: boolean
        -batteryLevel: number
        +useEffect(): void
        +update(status: DeviceStatus): void
        +handleConnect(): void
        +render(): JSX.Element
    }

    DeviceStatusManager ..|> DeviceStatusSubject
    CaneStatusCard ..|> DeviceStatusObserver
    ConnectionCard ..|> DeviceStatusObserver
    DeviceStatusManager --> DeviceStatus
    DeviceStatusObserver --> DeviceStatus
    DeviceStatusManager --> DeviceStatusObserver : notifies
    CaneStatusCard --> DeviceStatusManager : subscribes to
    ConnectionCard --> DeviceStatusManager : subscribes to
```

## Pattern Implementation: Observer Pattern

### Components:
- **Subject Interface**: `DeviceStatusSubject` - defines contract for managing observers
- **Concrete Subject**: `DeviceStatusManager` - singleton that holds device status and manages observer list
- **Observer Interface**: `DeviceStatusObserver` - defines update contract for observers  
- **Concrete Observers**: `CaneStatusCard` and `ConnectionCard` - UI components that react to status changes
- **Data Model**: `DeviceStatus` - encapsulates device state information

### How It Works:
1. UI components subscribe to `DeviceStatusManager` during mounting
2. `DeviceStatusManager` automatically polls device status every 3 seconds when connected
3. When status changes, all subscribed observers are notified via `update()` method
4. UI components automatically re-render with new status data
5. Components unsubscribe when unmounting to prevent memory leaks