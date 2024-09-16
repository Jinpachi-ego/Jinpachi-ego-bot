const { findUid } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
	config: {
		name: "adduser",
		version: "1.5",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		description: {
			vi: "Thêm thành viên vào box chat của bạn",
			en: "Add user to box chat of you"
		},
		category: "box chat",
		guide: {
			en: "   {pn} [link profile | uid]"
		}
	},

	langs: {
		vi: {
			alreadyInGroup: "Đã có trong nhóm",
			successAdd: "- Đã thêm thành công %1 thành viên vào nhóm",
			failedAdd: "- Không thể thêm %1 thành viên vào nhóm",
			approve: "- Đã thêm %1 thành viên vào danh sách phê duyệt",
			invalidLink: "Vui lòng nhập link facebook hợp lệ",
			cannotGetUid: "Không thể lấy được uid của người dùng này",
			linkNotExist: "Profile url này không tồn tại",
			cannotAddUser: "Bot bị chặn tính năng hoặc người dùng này chặn người lạ thêm vào nhóm"
		},
		en: {
			alreadyInGroup: "- 𝘓'𝘪𝘯𝘥𝘪𝘷𝘪𝘥𝘶𝘦 𝘦𝘴𝘵 𝘥𝘦́𝘫𝘢̀ 𝘥𝘢𝘯𝘴 𝘭𝘦 𝘨𝘳𝘰𝘶𝘱𝘦...😐",
			successAdd: "- 𝘓'𝘢𝘫𝘰𝘶𝘵 𝘥𝘦 %1 𝘮𝘦𝘮𝘣𝘳𝘦(𝘴) 𝘢𝘶 𝘨𝘳𝘰𝘶𝘱𝘦 𝘦𝘴𝘵 𝘶𝘯𝘦 𝘳𝘦́𝘶𝘴𝘴𝘪𝘵𝘦...🎉 ",
			failedAdd: "- 𝘓'𝘢𝘫𝘰𝘶𝘵 𝘥𝘦 %1 𝘮𝘦𝘮𝘣𝘳𝘦(𝘴) 𝘢𝘶 𝘨𝘳𝘰𝘶𝘱𝘦 𝘦𝘴𝘵 𝘶𝘯𝘦 𝘦́𝘤𝘩𝘦𝘤...🚫",
			approve: "- 𝘈𝘫𝘰𝘶𝘵 𝘥𝘦 %1 𝘮𝘦𝘮𝘣𝘳𝘦𝘴 𝘢̀ 𝘭𝘢 𝘭𝘪𝘴𝘵𝘦 𝘥'𝘢𝘱𝘱𝘳𝘰𝘣𝘢𝘵𝘪𝘰𝘯",
			invalidLink: "𝘝𝘦𝘶𝘪𝘭𝘭𝘦𝘻 𝘦𝘯𝘵𝘳𝘦́ 𝘶𝘯 𝘭𝘪𝘦𝘯 𝘧𝘢𝘤𝘦𝘣𝘰𝘰𝘬 𝘷𝘢𝘭𝘪𝘥𝘦...😕",
			cannotGetUid: "𝘐𝘮𝘱𝘰𝘴𝘴𝘪𝘣𝘭𝘦 𝘥'𝘰𝘣𝘵𝘦𝘯𝘪𝘳 𝘭'𝘶𝘪𝘥 𝘥𝘦 𝘤𝘦𝘵𝘵𝘦 𝘶𝘵𝘪𝘭𝘪𝘴𝘢𝘵𝘦𝘶𝘳..😕",
			linkNotExist: "𝘊𝘦𝘵𝘵𝘦 𝘜𝘙𝘓 𝘥𝘦 𝘱𝘳𝘰𝘧𝘪𝘭 𝘯'𝘦𝘹𝘪𝘴𝘵𝘦 𝘱𝘢𝘴...🙄",
			cannotAddUser: "𝘓𝘦 𝘤𝘰𝘯 𝘢 𝘥𝘶̂ 𝘦𝘮𝘱𝘦̂𝘤𝘩𝘦𝘳 𝘭𝘦𝘴 𝘦́𝘵𝘳𝘢𝘯𝘨𝘦𝘳𝘴 𝘥𝘦 𝘭'𝘢𝘫𝘰𝘶𝘵𝘦𝘳 𝘢𝘶 𝘨𝘳𝘰𝘶𝘱𝘦 𝘰𝘶 𝘭'𝘪𝘥𝘪𝘰𝘵 𝘲𝘶'𝘪𝘭 𝘦𝘴𝘵 𝘮'𝘢 𝘣𝘭𝘰𝘲𝘶𝘦́...😒"
		}
	},

	onStart: async function ({ message, api, event, args, threadsData, getLang }) {
		const { members, adminIDs, approvalMode } = await threadsData.get(event.threadID);
		const botID = api.getCurrentUserID();

		const success = [
			{
				type: "success",
				uids: []
			},
			{
				type: "waitApproval",
				uids: []
			}
		];
		const failed = [];

		function checkErrorAndPush(messageError, item) {
			item = item.replace(/(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)/i, '');
			const findType = failed.find(error => error.type == messageError);
			if (findType)
				findType.uids.push(item);
			else
				failed.push({
					type: messageError,
					uids: [item]
				});
		}

		const regExMatchFB = /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i;
		for (const item of args) {
			let uid;
			let continueLoop = false;

			if (isNaN(item) && regExMatchFB.test(item)) {
				for (let i = 0; i < 10; i++) {
					try {
						uid = await findUid(item);
						break;
					}
					catch (err) {
						if (err.name == "SlowDown" || err.name == "CannotGetData") {
							await sleep(1000);
							continue;
						}
						else if (i == 9 || (err.name != "SlowDown" && err.name != "CannotGetData")) {
							checkErrorAndPush(
								err.name == "InvalidLink" ? getLang('invalidLink') :
									err.name == "CannotGetData" ? getLang('cannotGetUid') :
										err.name == "LinkNotExist" ? getLang('linkNotExist') :
											err.message,
								item
							);
							continueLoop = true;
							break;
						}
					}
				}
			}
			else if (!isNaN(item))
				uid = item;
			else
				continue;

			if (continueLoop == true)
				continue;

			if (members.some(m => m.userID == uid && m.inGroup)) {
				checkErrorAndPush(getLang("alreadyInGroup"), item);
			}
			else {
				try {
					await api.addUserToGroup(uid, event.threadID);
					if (approvalMode === true && !adminIDs.includes(botID))
						success[1].uids.push(uid);
					else
						success[0].uids.push(uid);
				}
				catch (err) {
					checkErrorAndPush(getLang("cannotAddUser"), item);
				}
			}
		}

		const lengthUserSuccess = success[0].uids.length;
		const lengthUserWaitApproval = success[1].uids.length;
		const lengthUserError = failed.length;

		let msg = "";
		if (lengthUserSuccess)
			msg += `${getLang("successAdd", lengthUserSuccess)}\n`;
		if (lengthUserWaitApproval)
			msg += `${getLang("approve", lengthUserWaitApproval)}\n`;
		if (lengthUserError)
			msg += `${getLang("failedAdd", failed.reduce((a, b) => a + b.uids.length, 0))} ${failed.reduce((a, b) => a += `\n    + ${b.uids.join('\n       ')}: ${b.type}`, "")}`;
		await message.reply(msg);
	}
};
