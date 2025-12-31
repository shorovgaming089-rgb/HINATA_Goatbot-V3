const DIG = require("discord-image-generation");
const fs = require("fs-extra");

const AVATAR_API = "https://nagi-sheishiro7x.vercel.app/pp?uid=";

module.exports = {
	config: {
		name: "slap",
		version: "2.6",
		author: "NTKhang (modified)",
		countDown: 5,
		role: 0,
		shortDescription: "Batslap image",
		longDescription: "Batslap image",
		category: "image",
		guide: {
			en: "{pn} @tag | reply"
		}
	},

	onStart: async function ({ event, message, args }) {
		const uid1 = event.senderID;

		let uid2 = null;

		if (event.messageReply)
			uid2 = event.messageReply.senderID;
		else
			uid2 = Object.keys(event.mentions)[0];

		if (!uid2)
			return message.reply("You need to tag a person to slap Ã°Å¸ÂÂ¸");

		if (uid2 === "61555908092045")
			return message.reply("Slap yourself Dude Ã°Å¸ÂÂ¸Ã°Å¸ÂÂ¸!");

		const avatar1 = `${AVATAR_API}${uid1}`;
		const avatar2 = `${AVATAR_API}${uid2}`;

		const img = await new DIG.Batslap().getImage(avatar1, avatar2);
		const pathSave = `${__dirname}/tmp/${uid1}_${uid2}_slap.png`;

		fs.writeFileSync(pathSave, Buffer.from(img));

		message.reply(
			{
				body: args.join(" ") || "BÃƒÂ³pppp Ã°Å¸ËœÂµÃ¢â‚¬ÂÃ°Å¸â€™Â«Ã°Å¸ËœÂµ",
				attachment: fs.createReadStream(pathSave)
			},
			() => fs.unlinkSync(pathSave)
		);
	}
};
