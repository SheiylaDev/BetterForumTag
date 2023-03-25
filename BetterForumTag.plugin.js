/**
 * @name BetterForumTag
 * @author Sheiylanie
 * @authorId 183948625368317952
 * @version 1.0.1
 * @description Adds a more noticeable Tag to Forum Channels
 * @source https://github.com/SheiylaDev/BetterForumTag/
 * @updateUrl https://github.com/SheiylaDev/BetterForumTag/blob/main/BetterForumTag.plugin.js
 */

module.exports = (_ => {
	const changeLog = {
		
	};
	
	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		constructor (meta) {for (let key in meta) this[key] = meta[key];}
		getName () {return this.name;}
		getAuthor () {return this.author;}
		getVersion () {return this.version;}
		getDescription () {return `The Library Plugin needed for ${this.name} is missing. Open the Plugin Settings to download it. \n\n${this.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${this.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(this.name)) window.BDFDB_Global.pluginQueue.push(this.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${this.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		return class BetterForumTag extends Plugin {
			onLoad () {
				this.modulePatches = {
					before: [
						"ChannelItem"
					]
				};
				
				this.css = `
					${BDFDB.dotCN._betternforumtagtag} {
						margin-left: 2px;
					}
					${BDFDB.dotCN.channelcontainerdefault}:hover ${BDFDB.dotCN.channeliconitem} ~ ${BDFDB.dotCN._betternforumtagtag} {
						display: none;
					}
				`;
			}
			
			onStart () {
				BDFDB.ChannelUtils.rerenderAll();
			}
			
			onStop () {
				BDFDB.ChannelUtils.rerenderAll();
			}

			processChannelItem (e) {
				if (e.instance.props.channel && (e.instance.props.channel.type == 15) && !BDFDB.ReactUtils.findChild(e.instance.props.children, {key: "FORUM_TAG"})) e.instance.props.children.push(BDFDB.ReactUtils.createElement("div", {
					key: "FORUM_TAG",
					className: BDFDB.disCNS._betternforumtagtag + BDFDB.disCN.channelchildiconbase,
					children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Badges.TextBadge, {
						style: {borderRadius: "3px"},
                        color: "var(--bdfdb-blurple)",
						text: "FORUM"
					})
				}));
			}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(changeLog));
})();