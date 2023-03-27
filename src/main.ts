import { hookFunction, isObject, settingsSave, VERSION } from './utils';
import { init_modules, unload_modules } from 'modules';
import './modules';
import { SettingsModel } from 'Settings/Models/settings';

function initWait() {
	console.debug("BCX: Init wait");
	if (CurrentScreen == null || CurrentScreen === "Login") {
		hookFunction("LoginResponse", 0, (args, next) => {
			console.debug("BCX: Init LoginResponse caught", args);
			next(args);
			const response = args[0];
			if (isObject(response) && typeof response.Name === "string" && typeof response.AccountName === "string") {
				loginInit(args[0]);
			}
		});
		console.log(`ClubGames Ready!`);
	} else {
		console.debug("LSCG: Already logged in, init");
		init();
	}
}

export function loginInit(C: any) {
	if (window.LSCG_Loaded)
		return;
	init();
}

export function initSettings() {
	PreferenceSubscreenList.push("LSCGMainMenu");
	hookFunction("TextGet", 2, (args: string[], next: (arg0: any) => any) => {
		if (args[0] == "HomepageLSCGMainMenu") return "LSCG Settings";
		return next(args);
	});
	hookFunction("DrawButton", 2, (args: string[], next: (arg0: any) => any) => {
		if (args[6] == "Icons/LSCGMainMenu.png") args[6] = "Icons/Asylum.png";
		return next(args);
	});
}

export function init() {
	if (window.LSCG_Loaded)
		return;
	
		// clear any old settings.
	if (!!(<any>Player.OnlineSettings)?.LittleSera)
		delete (<any>Player.OnlineSettings).LittleSera;
	if (!!(<any>Player.OnlineSettings)?.ClubGames)
		delete (<any>Player.OnlineSettings).ClubGames;

    Player.LSCG = Player.OnlineSettings.LSCG || <SettingsModel>{};
	settingsSave();

	initSettings();

	if (!init_modules()) {
		unload();
		return;
	}

	const currentAccount = Player.MemberNumber;
	if (currentAccount == null) {
		throw new Error("No player MemberNumber");
	}

	hookFunction("LoginResponse", 0, (args, next) => {
		const response = args[0];
		if (isObject(response) && typeof response.Name === "string" && typeof response.AccountName === "string" && response.MemberNumber !== currentAccount) {
			alert(`Attempting to load LSCG with different account than already loaded (${response.MemberNumber} vs ${currentAccount}). This is not supported, please refresh the page.`);
			throw new Error("Attempting to load LSCG with different account");
		}
		return next(args);
	});

	window.LSCG_Loaded = true;
	console.log(`LSCG loaded! Version: ${VERSION}`);
}

export function unload(): true {
	unload_modules();

	delete window.LSCG_Loaded;
	console.log("LSCG: Unloaded.");
	return true;
}

initWait();