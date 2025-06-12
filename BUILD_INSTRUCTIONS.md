# Build and Deployment Instructions for FileSimplifier

## Prerequisites

1. **Node.js and npm**: Ensure you have Node.js and npm installed on your system.
2. **Angular CLI**: Install Angular CLI globally if not already installed:

   ```bash
   npm install -g @angular/cli
   ```

3. **Electron**: Install Electron globally if not already installed:

   ```bash
   npm install -g electron
   ```

4. **Electron Builder**: Ensure `electron-builder` is installed as a dev dependency in the project.

## Building the App

### Steps to Build the Angular App

1. Navigate to the `app` directory or check if you are in it:

   ```bash
   cd app
   ```

2. Build the Angular app:

   ```bash
   ng build --base-href ./ --deploy-url ./
   ```

### Steps to Build the Electron App

1. Ensure the Angular app is built (as shown above).
2. Run the Electron app locally:

   ```bash
   npm run electron
   ```

3. To package the app for macOS, Windows, and Linux, run:

   ```bash
   npm run build:electron
   ```

4. The packaged app will be available in the `dist-electron` directory.

## Building Docker Images for macOS, Windows, and Linux

### Docker Prerequisites

1. **Docker**: Ensure Docker is installed and running on your system.

### Steps to Build the Docker Image

1. Navigate to the root directory of the project:

   ```bash
   cd ..
   ```

2. Build the Docker image:

   ```bash
   docker build -t filesimplifier:latest -f FileSimplifier/Dockerfile .
   ```

### Running the Docker Container

1. Run the Docker container:

   ```bash
   docker run -p 8080:80 filesimplifier:latest
   ```

2. Access the app in your browser at `http://localhost:8080`.

## Notes

- For macOS, ensure you have the necessary permissions to run the app.
- For Windows, ensure the `.exe` file is signed if distributing to other users.
- For Linux, the `.AppImage` file can be made executable using:

  ```bash
  chmod +x FileSimplifier.AppImage
  ```

Let me know if you encounter any issues or need further assistance!
