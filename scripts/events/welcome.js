const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "𝗮𝗽𝗿𝗲̀𝘀 𝗺𝗶𝗱𝗶 ❀",
			session2: "𝘀𝗼𝗶𝗿𝗲́𝗲 ❀",
			session3: "𝗺𝗮𝘁𝗶𝗻𝗲́𝗲 ❀",
			session4: "𝗮𝗽𝗿𝗲̀𝘀 𝗺𝗶𝗱𝗶 ❀",
			welcomeMessage: "\n╭━━━━━━━━━━━◆\n│❀✦𝐉𝐈𝐍𝐏𝐀𝐂𝐇𝐈 𝐄𝐆𝐎✦❀\n╰━━━━━━━━━━━◆\n𝗙𝗲́𝗹𝗶𝗰𝗶𝘁𝗮𝘁𝗶𝗼𝗻 𝗷𝗲𝘂𝗻𝗲𝘀 𝗽𝗿𝗼𝗱𝗶𝗴𝗲𝘀 𝗮̀ 𝗹'𝗮𝘃𝗲𝗻𝗶𝗿 𝗽𝗿𝗼𝗺𝗲𝘁𝘁𝗲𝘂𝗿.\n𝗩𝗼𝘂𝘀 𝗳𝗮𝗶𝘁𝗲𝘀 𝗽𝗮𝗿𝘁𝗶𝗲 𝗱𝗲 𝗰𝗲𝘂𝘅 𝗾𝘂𝗶 𝗽𝗲𝘂𝘃𝗲𝗻𝘁 𝗱𝗲́𝘀𝗼𝗿𝗺𝗮𝗶𝘀 𝗺'𝘂𝘁𝗶𝗹𝗶𝘀𝗲𝗿.\n𝗠𝗲 𝗰𝗼𝗻𝗰𝗲𝗿𝗻𝗮𝗻𝘁 𝗷𝗲 𝘀𝘂𝗶𝘀 ✦𝐉𝐈𝐍𝐏𝐀𝐂𝐇𝐈 𝐄𝐆𝐎✦\n𝗠𝗼𝗻 𝗽𝗿𝗲𝗳𝗶𝘅 [%1]\n━━━━━━━━━━━◆",
			multiple1: "you",
			multiple2: "you guys",
			defaultWelcomeMessage: `𝗕𝗼𝗻𝗷𝗼𝘂𝗿 ❀{userName}❀\n𝗕𝗶𝗲𝗻𝘃𝗲𝗻𝘂𝗲 𝗱𝗮𝗻𝘀 𝗻𝗼𝘁𝗿𝗲 𝗴𝗿𝗼𝘂𝗽𝗲 ⚽{boxName}⚽ 𝗝𝗲𝘂𝗻𝗲 𝗽𝗿𝗼𝗱𝗶𝗴𝗲 𝗮̀ 𝗹'𝗮𝘃𝗲𝗻𝗶𝗿 𝗽𝗿𝗼𝗺𝗲𝘁𝘁𝗲𝘂𝗿 \n𝗡𝗼𝘂𝘀 𝘀𝗼𝗺𝗺𝗲𝘀 𝗿𝗮𝘃𝗶𝘀 𝗱𝗲 𝘁'𝗮𝗰𝗰𝘂𝗲𝗶𝗹𝗹𝗶𝗿 𝗽𝗮𝗿𝗺𝗶 𝗻𝗼𝘂𝘀. 𝗕𝗼𝗻𝗻𝗲 {session}...❀`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				// if new member is bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(getLang("welcomeMessage", prefix));
				}
				// if new member:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				// push new member to array
				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				// if timeout is set, clear it
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				// set new timeout
				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}
					// {userName}:   name of new member
					// {multiple}:
					// {boxName}:    name of group
					// {threadName}: name of group
					// {session}:    session of day
					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } =
						threadData.data;
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(
							/\{multiple\}/g,
							multiple ? getLang("multiple2") : getLang("multiple1")
						)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					form.body = welcomeMessage;

					if (threadData.data.welcomeAttachment) {
						const files = threadData.data.welcomeAttachment;
						const attachments = files.reduce((acc, file) => {
							acc.push(drive.getFile(file, "stream"));
							return acc;
						}, []);
						form.attachment = (await Promise.allSettled(attachments))
							.filter(({ status }) => status == "fulfilled")
							.map(({ value }) => value);
					}
					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
