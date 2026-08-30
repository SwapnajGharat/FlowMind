# FlowMind Frontend

This guide explains how to open and run the FlowMind website on a new laptop.

## What you need

You need the following before starting:

1. A laptop with an internet connection.
2. [Node.js LTS](https://nodejs.org/) installed. Download the **LTS** version, open the downloaded installer, and keep the default options while installing.
3. [Git](https://git-scm.com/downloads) installed, so you can download the project from GitHub.
4. A code editor such as [Visual Studio Code](https://code.visualstudio.com/) (recommended, but optional).

## Step 1: Check Node.js is installed

Open **PowerShell** (Windows) or **Terminal** (macOS/Linux), then run:

```bash
node --version
npm --version
```

Both commands should display a version number. If either command is not recognized, restart the terminal after installing Node.js.

## Step 2: Download the project

In PowerShell or Terminal, choose where you want to save the project and run:

```bash
git clone https://github.com/SwapnajGharat/FlowMind.git
cd FlowMind
```

If you already downloaded the project as a ZIP file, extract it first, open a terminal in the extracted `FlowMind` folder, and skip the `git clone` command.

## Step 3: Install the required packages

From the main `FlowMind` folder, run:

```bash
npm install
```

Wait until it finishes. This creates a `node_modules` folder automatically. Do not upload this folder to GitHub.

## Step 4: Start the website

Run:

```bash
npm run dev
```

In a second terminal, start the local API and SQLite history store:

```bash
npm run server
```

The API runs at `http://localhost:3001`; Vite forwards `/api` requests to it.
It creates `data/flowmind.sqlite` automatically and saves chat messages,
checklist changes, lab bookings, product analyses, and activity history.

The terminal will show a local address. Open the following address in a browser:

```text
http://localhost:3000
```

You should now see the FlowMind website.

## Step 5: Stop the website

Return to the terminal where the website is running and press:

```text
Ctrl + C
```

## Using the project again later

Open a terminal in the `FlowMind` folder and run:

```bash
npm run dev
```

You only need to run `npm install` again if the project dependencies change.

## Troubleshooting

### `npm` or `node` is not recognized

Install Node.js LTS, then close and reopen PowerShell/Terminal.

### Port 3000 is already being used

Close any other terminal that is running the project, or stop it with `Ctrl + C`, then run `npm run dev` again.

### The page does not open

Copy the exact `Local:` URL shown in the terminal and paste it into your browser. Make sure the `npm run dev` terminal is still running.

## Important security note

Never commit `.env.local` files, passwords, or API keys to GitHub. The repository already ignores these private files.
