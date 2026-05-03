# Operon Ai Backend

Minimal Node.js + Express backend skeleton.

## Scripts

- `npm run start` - Run the server
- `npm run dev` - Run the server (alias)

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm run start
   ```

The server listens on port 3000.

## Endpoint

- `POST /ticket`
  - JSON body:
    ```json
    {
      "userId": "string",
      "message": "string"
    }
    ```
  - Response:
    ```json
    {
      "status": "ok"
    }
    ```
