import { RemoteGuiSubscreen } from "./remoteBase";
import { Setting } from "Settings/settingBase";
import { BaseSettingsModel } from "Settings/Models/base";
import { HypnoPublicSettingsModel } from "Settings/Models/hypno";
import { ICONS } from "utils";

export class RemoteHypno extends RemoteGuiSubscreen {
	subscreens: RemoteGuiSubscreen[] = [];

	get name(): string {
		return "Hypnosis";
	}

	get overrideMemberIds(): number[] {
		return this.settings.overrideMemberIds?.split(",").map(id => +id).filter(id => id > 0) ?? [];
	}

	get enabled(): boolean {
		return this.settings.enabled && 
			this.settings.remoteAccess &&
			(this.overrideMemberIds.indexOf(Player.MemberNumber!) > -1 || ServerChatRoomGetAllowItem(Player, this.Character))
	}

	get icon(): string {
		return ICONS.HYPNO;
	}

	get settings(): HypnoPublicSettingsModel {
		return super.settings as HypnoPublicSettingsModel;
	}

	get structure(): Setting[] {
		return [
			<Setting>{
				type: "checkbox",
				label: "Enabled:",
				description: "Enabled the Hypnosis Features.",
				setting: () => this.settings.enabled ?? false,
				setSetting: (val) => this.settings.enabled = val
			},<Setting>{
				type: "checkbox",
				label: "Immersive Hypnosis:",
				description: "Makes the hypnotized experience more restrictive. LSCG settings will be unavailable while hypnotized.",
				setting: () => this.settings.immersive ?? false,
				setSetting: (val) => this.settings.immersive = val
			},<Setting>{
				type: "text",
				id: "hypno_overrideWords",
				label: "Override Trigger Words:",
				description: "Custom list of words and/or phrases as hypnisis triggers. Separated by a comma.",
				setting: () => this.settings.overrideWords ?? "",
				setSetting: (val) => this.settings.overrideWords = val
			},<Setting>{
				type: "text",
				id: "hypno_overrideMembers",
				label: "Override Allowed Member IDs:",
				description: "Comma separated list of member IDs. If empty will use standard Item Permissions.",
				setting: () => this.settings.overrideMemberIds ?? "",
				setSetting: (val) => this.settings.overrideMemberIds = val
			},<Setting>{
				type: "checkbox",
				label: "Enable Cycle:",
				description: "If checked, only one trigger will be active at a time and will cycle after use.",
				setting: () => this.settings.enableCycle ?? false,
				setSetting: (val) => this.settings.enableCycle = val
			},<Setting>{
				type: "number",
				id: "hypno_cycleTime",
				label: "Trigger Cycle Time (min.):",
				description: "Number of minutes after activation to wait before cycling to a new trigger.",
				setting: () => (this.settings.cycleTime ?? 30),
				setSetting: (val) => this.settings.cycleTime = val
			},<Setting>{
				type: "number",
				id: "hypno_triggerTime",
				label: "Hypnosis Length (min.):",
				description: "Length of hypnosis time (in minutes) before automatically recovering. Set to 0 for indefinite.",
				setting: () => (this.settings.triggerTime ?? 5),
				setSetting: (val) => this.settings.triggerTime = val
			},<Setting>{
				type: "number",
				id: "hypno_cooldownTime",
				label: "Cooldown (sec.):",
				description: "Cooldown time (in seconds) before you can be hypnotized again.",
				setting: () => (this.settings.cooldownTime ?? 0),
				setSetting: (val) => this.settings.cooldownTime = val
			},<Setting>{
				type: "checkbox",
				label: "Locked:",
				disabled: !this.settings.allowLocked,
				description: "If checked, locks the user out of their own hypnosis settings.",
				setting: () => this.settings.locked ?? false,
				setSetting: (val) => {
					if (this.settings.allowLocked) this.settings.locked = val;
				}
			}
		]
	}
}