<div align="center">

# 🌅 Morning Routine for Obsidian

*Start your day right. Track your mood, measure your productivity, and effortlessly backup your vault.*

[![Obsidian Downloads](https://img.shields.io/badge/Obsidian-Plugin-7A36F4.svg?logo=obsidian)](#)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ Overview

**Morning Routine** is an Obsidian plugin designed to simplify and supercharge your daily journaling habit. 

Instead of manually creating your daily note, dealing with templates, and remembering to push your vault to your Git repository, Morning Routine gives you a beautifully seamless start to your day. With a single click, answer a few quick questions and let the plugin handle the rest: note creation, formatting, and even remote Git backups!

## 🚀 Features

- **🎛️ Quick-Entry Modal:** An intuitive popup to quickly log your wake-up time, current mood (1-10), and expected productivity level.
- **📝 Automated Daily Notes:** Automatically generates a beautifully formatted markdown note for the day.
- **📊 Dataview Integration:** Pre-configured with Dataview snippets to show you which notes you created and modified today.
- **📂 Configurable Paths:** Choose exactly which folder your daily routine notes should be saved to.
- **☁️ Auto-Backup (Git Seamless Sync):** Automatically runs `git add`, `git commit`, and `git push` to your remote repository the moment you submit your routine, ensuring your vault is always safely backed up. 
- **⚡ Instant Open:** Automatically opens your newly minted daily note in the active workspace tab so you can immediately start expanding on your thoughts.

---

## 📸 How It Works

1. Click the **Sun Icon** (🌅) in your left-hand ribbon, or use the Command Palette (`Ctrl/Cmd + P`) and search for **Start Morning Routine**.
2. An elegant modal will appear. 
3. Adjust the **Time**, slide your **Mood** score, and gauge your **Productivity**.
4. Click **Submit**.
5. Boom! 💥 Your note is created, opened for you, and automatically pushed to your Git remote.

---

## ⚙️ Requirements

To get the most out of Morning Routine, ensure you have:
1. **Obsidian** (Obviously!)
2. **Git** installed on your system.
3. Your vault setup mapped to a remote repository (e.g., GitHub, GitLab) so the automatic `git push` command can run successfully.
4. **Dataview Plugin** (Optional, but highly recommended) - The generated daily note includes Dataview queries to show your daily activity block.

---

## 📦 Installation

*(Because this plugin might not be in the official community store yet, you can install it manually)*

### Manual Installation
1. Download the latest release (`main.js`, `manifest.json`, `styles.css`).
2. Navigate to your Obsidian vault's plugin directory: `/.obsidian/plugins/`
3. Create a folder named `routines` (or your preferred name).
4. Paste the downloaded files into this new folder.
5. Reload Obsidian.
6. Go to **Settings > Community Plugins** and enable **Morning Routine**.

---

## 🛠️ Configuration

Go to your Obsidian Settings and find **Morning Routine** under the Community Plugins list.
Here you can configure:

- **Daily Note Folder:** The specific folder where you want your morning routine notes to be saved (e.g., `Journal` or `Daily Notes`). If left blank, they will be created in the root directory.

---

## ❤️ Contributing & Support

Feel free to open an issue or submit a pull request if you have ideas on how to make Morning Routine even better!

If you find this plugin helpful for your daily workflow, consider giving the repository a ⭐️!

---
<div align="center">
  <i>Built with ❤️ for the Obsidian Community</i>
</div>
