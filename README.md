# IntelliVisa RedApp Web Module

This project is a Sabre Red App web module for IntelliVisa.

## Prerequisites

- Node.js (LTS version recommended)
- Sabre Red Web SDK 25.11

## Setup Instructions

### 1. Download and Install Sabre Red Web SDK

1. Download the **Sabre Red Web SDK 25.11** from the official Sabre Developer Portal:
   - [https://developer.sabre.com/sdk/sabre-red/25.11/resources.html](https://developer.sabre.com/sdk/sabre-red/25.11/resources.html)

2. Follow the installation and setup steps provided in the SDK's readme file

### 2. Run the IntelliVisa RedApp

Once the SDK is properly configured, start the development server:

```bash
ngv run
```

The application will start and be available at:

```
http://localhost:8080
```

### 3. Load the Module in Sabre Development Environment

1. **Login to the Sabre Development Environment:**
   - Navigate to: [https://srw.cert.sabre.com/](https://srw.cert.sabre.com/)

2. **Configure the Red App:**
   - Once the Sabre development environment loads, click on **"Red App Development"** from the right menu panel
   - In the **"Red App web module URL"** input field, enter:
     ```
     http://localhost:8080
     ```
   - Click the **"Reload"** button

3. **View Your Changes:**
   - Your development changes will now appear in the Sabre development environment
   - Any changes you make to the code will be reflected after reloading the module

## Development Workflow

1. Make changes to your code in the `src/` directory
2. The development server will automatically rebuild (if watch mode is enabled)
3. Click "Reload" in the Red App Development panel to see your changes

## Project Structure

- `src/` - Source code
  - `code/` - Main application code
  - `components/` - React components
  - `store/` - Redux store, actions, and reducers
  - `styles/` - LESS stylesheets
  - `i18n/` - Translation files
- `build/` - Build output
- `src/guides/` - Additional documentation

## Creating a PNR in CERT Environment

To generate a valid PNR in the CERT environment, enter these commands in sequence in the Sabre Red 360 emulator (ensure you are logged into the CERT environment):

1. **Check Availability:** `1[Date][Origin][Destination]`
   - Example: `125JULDOHMCT`

2. **Sell Seats:** Choose and select seats from the availability list

3. **Add Passenger Name:** `-[LastName]/[FirstName]`
   - Example: `-DOE/JOHN`

4. **Add Phone Number:** `9[Phone]`
   - Example: `90123456789-T`

5. **Add Ticket Time Limit:** `7TAW/`
   - Example: `7TAW20JAN/` (to set a ticket-at-wharf deadline)

6. **Received From:** `6[YourName]`
   - Example: `6DEVELOPER`

7. **End and Retrieve:** `ER`
   - This saves the PNR and displays the 6-character Record Locator needed for retrieval

For more information, refer to this guide: [https://www.youtube.com/watch?v=V62x-85shp4](https://www.youtube.com/watch?v=V62x-85shp4)

## Support

For issues related to the Sabre Red Web SDK, please refer to the [Sabre Developer Portal](https://developer.sabre.com/).
