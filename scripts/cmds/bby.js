.cmd install bby.js const axios = require('axios'); 
const baseApiUrl = async () => {     
    return "http://noobs-api.top/dipto"; 
};  

module.exports.config = {     
    name: "bby",     
    aliases: ["baby", "bbe", "babe", "hina"],     
    version: "6.9.0",     
    author: "dipto",     
    countDown: 0,     
    role: 0,     
    description: "better then all sim simi",     
    category: "chat",     
    guide: {         
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"     
    } 
};  

module.exports.onStart = async ({ api, event, args, usersData }) => {     
    const link = `${await baseApiUrl()}/baby`;     
    const dipto = args.join(" ").toLowerCase();     
    const uid = event.senderID;     
    let command, comd, final;      

    try {         
        if (!args[0]) {             
            const ran = ["বল তো বেবি", "হুম", "টাইপ করো help baby", "টাইপ করো !baby hi"];             
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);         
        }  

        if (args[0] === 'remove') {             
            const fina = dipto.replace("remove ", "");             
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;             
            return api.sendMessage(dat, event.threadID, event.messageID);         
        }          

        if (args[0] === 'rm' && dipto.includes('-')) {             
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);             
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;             
            return api.sendMessage(da, event.threadID, event.messageID);         
        }          

        if (args[0] === 'list') {             
            if (args[1] === 'all') {                 
                const data = (await axios.get(`${link}?list=all`)).data;                 
                const limit = parseInt(args[2]) || 100;                 
                const limited = data?.teacher?.teacherList?.slice(0, limit)                 
                const teachers = await Promise.all(limited.map(async (item) => {                     
                    const number = Object.keys(item)[0];                     
                    const value = item[number];                     
                    const name = await usersData.getName(number).catch(() => number) || "Not found";                     
                    return {                         
                        name,                         
                        value                     
                    };                 
                }));                 
                teachers.sort((a, b) => b.value - a.value);                 
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');                 
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);             
            } else {                 
                const d = (await axios.get(`${link}?list=all`)).data;                 
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);             
            }         
        }          

        if (args[0] === 'msg') {             
            const fuk = dipto.replace("msg ", "");             
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;             
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);         
        }          

        if (args[0] === 'edit') {             
            const command = dipto.split(/\s*-\s*/)[1];             
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);             
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;             
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);         
        }          

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {             
            [comd, command] = dipto.split(/\s*-\s*/);             
            final = comd.replace("teach ", "");             
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);             
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);             
            const tex = re.data.message;             
            const teacher = (await usersData.get(re.data.teacher)).name;             
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);         
        }          

        if (args[0] === 'teach' && args[1] === 'amar') {             
            [comd, command] = dipto.split(/\s*-\s*/);             
            final = comd.replace("teach ", "");             
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);             
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;             
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);         
        }          

        if (args[0] === 'teach' && args[1] === 'react') {             
            [comd, command] = dipto.split(/\s*-\s*/);             
            final = comd.replace("teach react ", "");             
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);             
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;             
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);         
        }          

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {             
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;             
            return api.sendMessage(data, event.threadID, event.messageID);         
        }          

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;         
        api.sendMessage(d, event.threadID, (error, info) => {             
            global.GoatBot.onReply.set(info.messageID, {                 
                commandName: this.config.name,                 
                type: "reply",                 
                messageID: info.messageID,                 
                author: event.senderID,                 
                d,                 
                apiUrl: link             
            });         
        }, event.messageID);      

    } catch (e) {         
        console.log(e);         
        api.sendMessage("Check console for error", event.threadID, event.messageID);     
    } 
};  

module.exports.onReply = async ({ api, event, Reply }) => {         
    if ([api.getCurrentUserID()].includes(event.senderID)) return;        
    try {         
        if (event.type == "message_reply") {             
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;             
            await api.sendMessage(a, event.threadID, (error, info) => {                 
                global.GoatBot.onReply.set(info.messageID, {                     
                    commandName: this.config.name,                     
                    type: "reply",                     
                    messageID: info.messageID,                     
                    author: event.senderID,                     
                    a                 
                });             
            }, event.messageID);         
        }     
    } catch (err) {         
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);     
    } 
};  

module.exports.onChat = async ({ api, event, message }) => {     
    try {         
        const body = event.body ? event.body?.toLowerCase() : ""         
        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("hina") || body.startsWith("hinata") || body.startsWith("janu")) {             
            const arr = body.replace(/^\S+\s*/, "")             


            const randomReplies = [
                " আমরা দারুণ রকমের দুঃখ সাজাই প্রবল ভালোবেসে..!😅💔",
      "- আমি যখন একটু খুশি হওয়ার চেষ্টা করি, তখন দুঃখ এসে আবার আমাকে আঁকড়ে ধরে 😅💔",
      " °°অনুভূতি প্রকাশ করতে নেই মানুষ নাটক মনে করে মজা নেয়°..! 😥💔🥀",
      " কিছু মানুষ স্বল্প সময়ের জন্য আমাদের জীবনে আসে।কিন্তু দীর্ঘ সময় স্মৃতি রেখে যায়..!🙂💔",
      "𝙴𝙸 𝙿𝙰𝙶𝙾𝙻 𝙴𝚃𝙾 𝙳𝙰𝙺𝙾𝚂 𝙺𝙴𝙽?",
      " 𝙼𝚈𝙱 𝙸 𝙹𝚄𝚂𝚃 𝚆𝙰𝙽𝙽𝙰 𝙱𝙴 𝚈𝙾𝚄𝚁𝚂 ? 😌💝",
      " 𝙸 𝚂𝙰𝚈 𝙸 𝙻𝙾𝚅𝙴 𝚈𝙾𝚄 𝙵𝙾𝚁𝙴𝚅𝙴𝚁💝🐼",
      "য়ামরা কি ভন্দু হতে পারিহ?? নাহ্লে তার থেকে বেসি কিচু??😋",
      " 𝚈𝚄𝙼𝙼𝚈 𝙱𝙱𝚈 𝚈𝙾𝚄 𝙰𝚁𝙴 𝚂𝙾 𝚂𝚆𝙴𝙴𝚃😋🤤",
      "𝙰𝚌𝙲𝙲𝙰𝙷 𝙱𝙾𝙻𝙾 𝙰𝙼𝙺𝙴 𝙻𝙰𝙶𝙱𝙴 𝙽𝙰𝙺𝙸 𝚁𝚄𝚂𝚂𝙸𝙰𝙽 ?",
      "তোর সাথে কথা নাই কারণ তুই অনেক লুচ্চা",
      " এইখানে লুচ্চামি করলে লাথি দিবো কিন্তু",
      "আমাকে চুমু দিবি 🫢🦋",
      "হেহে বাবু আমার কাছে আসো 😘💋",
      "আমি তোমাকে অনেক ভালোবাসি বাবু🥺💖",
      "  বট এর help list dekhte type koron Help",
      "কিরে বলদ তুই এইখানে 🙂",
      " আমাকেq চিনো না জানু? মনু",
      "hey bbe I'm your personal Based chatbot you ask me anything",
      "AR asbo na tor kache",
      "আমাকে ডাকলে ,আমি কিন্তু 𝐊𝐢𝐬𝐬 করে দিবো 😘",
      "Hop beda dakos kn🥲",
      "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱",
      " ওই মামী আর ডাকিস না প্লিজ🥲",
      " হ্যা বলো, শুনছি আমি",
      "বলো কি করতে পারি তোমার জন্য😌 ",
      "𝐁𝐨𝐭 না জানু,বলো কারন আমি সিংগেল 😌 ",
      " I love you tuna🥺🥶",
      "Tuma dew xanu😍😘 ",
      " এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
      " দেখা হলে কাঠগোলাপ দিও..🤗",
      "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺 ",
      "•-কিরে🫵 তরা নাকি  prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺 ",
      "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 ",
      "Single taka ki oporad🥺 ",
      " Premer mora jole duve na😛",
      "Ufff matha gorom kore disos😒 ",
      "Boss BaYjid er chipay😜 ",
      "bashi dakle boss BaYjid ke bole dimu😒 ",
      "Xhipay atke gaci jan🥲 ",
      "Washroom a🤣 ",
      "bado maser kawwa police amar sawwa😞 ",
      "I am single plz distrab me🥺🥲 ",
      "𝗮𝗺𝗶 𝗯𝗼𝘁 𝗻𝗮 𝗮𝗺𝗮𝗸𝗲 𝗯𝗯𝘆 𝗯𝗼𝗹𝗼 𝗯𝗯𝘆!!😘 ",
      "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲 ",
      "𝗛𝗶𝗶 𝗶 𝗮𝗺 𝗯𝗼𝘁 𝗰𝗮𝗻 𝗶 𝗵𝗲𝗹𝗽 𝘆𝗼𝘂!🤖 ",
      "𝗲𝘁𝗼 𝗯𝗼𝘁 𝗯𝗼𝘁 𝗻𝗮 𝗸𝗼𝗿𝗲 𝘁𝗮𝗸𝗮 𝗼 𝘁𝗼 𝗽𝗮𝗧𝗵𝗮𝘁𝗲 𝗽𝗮𝗿𝗼😒🥳🥳 ",
      "𝘁𝗼𝗿𝗲 𝗺𝗮𝗿𝗮𝗿 𝗽𝗿𝗲𝗽𝗲𝗿𝗮𝘁𝗶𝗼𝗻 𝗻𝗶𝗰𝗵𝗶...!!.🫡 ",
      "𝘂𝗺𝗺𝗮𝗵 𝗱𝗶𝗹𝗲 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂 𝗸𝗼𝗺𝘂 𝗸𝗶𝗻𝗧𝘂😑 ",
      " আমাকে ডাকলে ,আমি কিন্তু 𝐊𝐢𝐬𝐬 করে দিবো 😘",
      " Bal falaw😩",
      "Tapraiya dat falai demu🥴 ",
      "He🤤bolo amar jan kmn aso🤭 ",
      "Hmmm jan ummmmmmah🫣 ",
      "Chup kor ato bot bot koros kn😬 ",
      "Yes sir/mem😍 ",
      "Assalamualikum☺️💖 ",
      "Walaikumsalam😫🤓 ",
      "Chaiya takos kn ki kobi kooo☹️ ",
      "Onek boro beyadop re tui😒 ",
            ];

            if (!arr) {                  
                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {                     
                    if (!info) message.reply("info obj not found")                     
                    global.GoatBot.onReply.set(info.messageID, {                         
                        commandName: this.config.name,                         
                        type: "reply",                         
                        messageID: info.messageID,                         
                        author: event.senderID                     
                    });                 
                }, event.messageID)             
            }             

            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;             
            await api.sendMessage(a, event.threadID, (error, info) => {                 
                global.GoatBot.onReply.set(info.messageID, {                     
                    commandName: this.config.name,                     
                    type: "reply",                     
                    messageID: info.messageID,                     
                    author: event.senderID,                     
                    a                 
                });             
            }, event.messageID)         
        }     
    } catch (err) {         
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);     
    } 
};
