import { App, Modal, Plugin, PluginSettingTab, Setting, TFile, moment, normalizePath, Notice, FileSystemAdapter } from 'obsidian';

interface RoutinesSettings {
	dailyNoteFolder: string;
}

const DEFAULT_SETTINGS: RoutinesSettings = {
	dailyNoteFolder: '/'
}

export default class RoutinesPlugin extends Plugin {
	settings: RoutinesSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('sun', 'Start Morning Routine', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new MorningRoutineModal(this.app, this).open();
		});

		// Add a class for custom styling
		ribbonIconEl.addClass('morning-routine-ribbon-class');

		// This adds a command that can be triggered from the Command Palette
		this.addCommand({
			id: 'start-morning-routine',
			name: 'Start Morning Routine',
			callback: () => {
				new MorningRoutineModal(this.app, this).open();
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RoutinesSettingTab(this.app, this));
	}

	onunload() {
		// Plugin cleanup
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export class MorningRoutineModal extends Modal {
	plugin: RoutinesPlugin;
	time: string;
	mood: number = 5;
	productivity: number = 5;

	constructor(app: App, plugin: RoutinesPlugin) {
		super(app);
		this.plugin = plugin;
		// Auto-fill time with current system time in HH:mm format
		this.time = moment().format('HH:mm');
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('morning-routine-modal');

		contentEl.createEl('h2', { text: 'Morning Routine' });

		// 1. What time is it?
		new Setting(contentEl)
			.setName('What time is it?')
			.addText(text => {
				text.inputEl.type = 'time';
				text.setValue(this.time)
					.onChange(value => {
						this.time = value;
					});
			});

		// 2. How is your mood?
		new Setting(contentEl)
			.setName('How is your mood?')
			.setDesc('1 (Poor) to 10 (Excellent)')
			.addSlider(slider => slider
				.setLimits(1, 10, 1)
				.setValue(this.mood)
				.setDynamicTooltip()
				.onChange(value => {
					this.mood = value;
				}));

		// 3. How productive are you feeling?
		new Setting(contentEl)
			.setName('How productive are you feeling?')
			.setDesc('1 (Poor) to 10 (Excellent)')
			.addSlider(slider => slider
				.setLimits(1, 10, 1)
				.setValue(this.productivity)
				.setDynamicTooltip()
				.onChange(value => {
					this.productivity = value;
				}));

		// 4. Submit Button
		new Setting(contentEl)
			.addButton(btn => btn
				.setButtonText('Submit')
				.setCta()
				.onClick(async () => {
					await this.onSubmit();
					this.close();
				}));
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async onSubmit() {
		const now = moment(`1970-01-01T${this.time}`);
		// Extract hours and minutes from the time input, then apply to current moment
		const fileDate = moment().set({
			hour: now.hours(),
			minute: now.minutes()
		});

		const formattedDate = fileDate.format('DD.MM.YYYY HH:mm');
		const displayDate = fileDate.format('dddd, MMMM Do, YYYY');
		const fileName = fileDate.format('YYYY-MM-DD') + '.md';

		const markdownEntry = `---
date: ${formattedDate}
tags:
  - daily
cssclasses:
  - daily
mood: ${this.mood}/10
productivity: ${this.productivity}/10
---
# DAILY NOTE
## ${displayDate}
---
What i've done today:


---
### Notes created today
\`\`\`dataview
List FROM "" WHERE file.cday = date("<%tp.date.now("YYYY-MM-DD")%>") SORT file.ctime asc
\`\`\`

### Notes last touched today
\`\`\`dataview
List FROM "" WHERE file.mday = date("<%tp.date.now("YYYY-MM-DD")%>") SORT file.mtime asc
\`\`\`

`;

		let folderPath = this.plugin.settings.dailyNoteFolder;
		if (folderPath === '/' || folderPath === '') {
			folderPath = '';
		} else if (!folderPath.endsWith('/')) {
			folderPath += '/';
		}

		const filePath = normalizePath(folderPath + fileName);
		let abstractFile = this.app.vault.getAbstractFileByPath(filePath);
		let fileToOpen: TFile | null = null;

		if (abstractFile instanceof TFile) {
			// Do not overwrite, maybe just notify
			fileToOpen = abstractFile;
		} else if (!abstractFile) {
			// Create file if it doesn't exist

			// ensure folder exists
			if (folderPath !== '') {
				const folderObj = this.app.vault.getAbstractFileByPath(normalizePath(this.plugin.settings.dailyNoteFolder));
				if (!folderObj) {
					await this.app.vault.createFolder(normalizePath(this.plugin.settings.dailyNoteFolder));
				}
			}

			fileToOpen = await this.app.vault.create(filePath, markdownEntry);
		}

		// Open the file
		if (fileToOpen) {
			await this.app.workspace.getLeaf('tab').openFile(fileToOpen);
		}

		// Push to remote using git
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const { exec } = require('child_process');
			const adapter = this.app.vault.adapter;

			if (adapter instanceof FileSystemAdapter) {
				const basePath = adapter.getBasePath();
				new Notice("Pushing vault to remote...");

				exec('git add . && git commit -m "Morning Routine update" && git push', { cwd: basePath }, (error: any, stdout: string, stderr: string) => {
					if (error) {
						console.error(`Git push error: ${error.message}`);
						new Notice("Failed to push to remote. Check console.");
						return;
					}
					new Notice("Successfully pushed to remote.");
				});
			}
		} catch (e) {
			console.error("Child process error:", e);
			new Notice("Could not push to remote. Check console.");
		}
	}
}

class RoutinesSettingTab extends PluginSettingTab {
	plugin: RoutinesPlugin;

	constructor(app: App, plugin: RoutinesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Daily Note Folder')
			.setDesc('Folder where daily notes are created (e.g., "Journal" or "Daily Notes"). Leave blank for root directory.')
			.addText(text => text
				.setPlaceholder('Example: Journal')
				.setValue(this.plugin.settings.dailyNoteFolder)
				.onChange(async (value) => {
					this.plugin.settings.dailyNoteFolder = value;
					await this.plugin.saveSettings();
				}));
	}
}
