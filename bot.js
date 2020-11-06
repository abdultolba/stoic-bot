/*
  This is the main JS file for the bot. Where all the events are captured
  and the instantiation of the Discord Client Class takes place.
*/
const Discord = require("discord.js");
const meditations = require("meditations");
const util = require("./util");

require("dotenv").config();

// Create a new instance of the Discord Client Class.
const bot = new Discord.Client();

// Get the token and prefix from the .ENV file.
const token = process.env.DISCORD_TOKEN;
const prefix = process.env.COMMAND_PREFIX || "!";

// Check that we have a token in the .env file.
if (!token) {
  console.error("A token is required to connect to Discord.");
  process.exit(1);
}

// Check that we have a token set in the .env file.
if (!prefix) {
  console.error("A prefix is required to call commands.");
  process.exit(1);
}

// Ready is emitted whenever a message is created.
bot.on("ready", () => {
  bot.user.setActivity('!meditate | !shelp', { type: 'LISTENING' });

  const { discord } = util;
  // A little message to show that the bot has connected.
  console.log(
    `Bot is up and running, with ${discord.getOnlineUsers(
      bot.users
    )} online users, in ${discord.getTextChannels(
      bot.channels
    )} text channels and ${discord.getVoiceChannels(
      bot.channels
    )} voice channels.`
  );
});

// Message is emitted whenever the bot notices a new message.
bot.on("message", (message) => {
  // Destructure the message parameter so we don't repeat ourselves.
  const { author, channel, content, createdTimestamp } = message;

  // If the message doesn't contain the command prefix, we might as well leave it alone.
  if (content.indexOf(prefix) !== 0) return;

  // No point dealing with the message if it was sent by a bot!
  if (author.bot) return;

  // Get the the command and any arguments that were sent
  const args = content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  // If the command that was sent matches any of the commands that we have configured...
  if (command === "stoic-ping") {
    // It's nice to have a log of when the command was sent for future reference along with the person that sent it.
    console.log(
      `Command [${prefix + command}] Received from ${
        author.username
      } at ${util.helpers.convertTime(createdTimestamp)}`
    );

    // Send a message to the channel where the initial message came from.
    channel.send("Pong!");
  } else if (command === "meditate") {
    if (!args.length) {
      const quote = meditations.random();

      if (quote.length > 2000) {
        const quoteA = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setAuthor("Marcus Aurelius")
          .setDescription(`"${quote.slice(0, Math.floor(quote.length / 2))}`);

        const quoteB = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setDescription(`${quote.slice(Math.floor(quote.length / 2))}"`)
          .setTimestamp()
          .setFooter("StoicBot v1.0.0");

        channel.send(quoteA);
        return channel.send(quoteB);
      }

      return channel.send(
        new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setAuthor("Marcus Aurelius")
          .setDescription(`"${quote}"`)
          .setTimestamp()
          .setFooter("StoicBot v1.0.0")
      );
    }

    const passageNums = args[0].split(":");

    if (passageNums.length != 2) {
      const errorEmbed = new Discord.MessageEmbed()
        .setColor("#EA4552")
        .setDescription(
          "Error: Please provide valid book and passage numbers. e.g. **!meditate 5:11**"
        )
        .setTimestamp()
        .setFooter("StoicBot v1.0.0");
      return channel.send(errorEmbed);
    }

    const [book, phraseNum] = passageNums;

    if (isNaN(parseInt(book)) || isNaN(parseInt(phraseNum))) {
      const errorEmbed = new Discord.MessageEmbed()
        .setColor("#EA4552")
        .setDescription(
          "Error: Please provide valid *numerical* book and passage numbers. e.g. **!meditate 1:4**"
        )
        .setTimestamp()
        .setFooter("StoicBot v1.0.0");
      return channel.send(errorEmbed);
    }

    const quote = meditations.retrieve(book, phraseNum);
    if (typeof quote == "object") {
      const errorEmbed = new Discord.MessageEmbed()
        .setColor("#EA4552")
        .setDescription(`${quote}`)
        .setTimestamp()
        .setFooter("StoicBot v1.0.0");
      return channel.send(errorEmbed);
    }

    if (quote.length > 2000) {
      const quoteA = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setAuthor("Marcus Aurelius")
        .setDescription(`"${quote.slice(0, Math.floor(quote.length / 2))}`);

      const quoteB = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setDescription(`${quote.slice(Math.floor(quote.length / 2))}"`)
        .setTimestamp()
        .setFooter("StoicBot v1.0.0");

      channel.send(quoteA);
      return channel.send(quoteB);
    }

    return channel.send(
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setAuthor("Marcus Aurelius")
        .setDescription(`"${quote}"`)
        .setTimestamp()
        .setFooter("StoicBot v1.0.0")
    );
  } else if (command == "shelp") {
    let embed = new Discord.MessageEmbed()
      .setColor("#F5BC74")
      .setAuthor(
        "Stoic Bot",
        "https://res.cloudinary.com/friendly-social/image/upload/v1604602885/marcus.png",
        "https://www.github.com/abdultolba/stoic-bot"
      )
      .setTitle("Commands")
      .addFields(
        {
          name: "!meditate",
          value: "Retrieve a random quote from *The  Meditations*",
        },
        {
          name: "!meditate <book_num>:<passage_num>",
          value:
            "Retrieve a specific passage from *The Meditations* given a valid book and passage number.",
        },
        {
          name: "!shelp",
          value: "Retrieve a list of commands for the stoic bot.",
        }
      )
      .setTimestamp()
      .setFooter("StoicBot v1.0.0");

    return channel.send(embed);
  }
});

// This establishes a websocket connection to Discord.
bot.login(token);
