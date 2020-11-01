# Stoic Discord Bot 📖🧘‍♂️


### A Discord bot that provides quotes from Meditations, Enchiridion, and Epistulae Morales ad Lucilium.

### Configuration & Setup


#### Install Dependencies
Clone or fork the repo and install dependencies by running `npm install` if using `npm` or `yarn install` if using `yarn`.

#### Add Credentials
1. Run `cp .env.example .env` to store your tokens and keys.
2. Modify the `.env` file to store your `DISCORD_TOKEN` and `COMMAND_PREFIX` (default `!`)

#### Running the bot
Simply run `node bot.js` or `nodemon bot.js` if using nodemon

#### Commands
- Meditations
    - *!meditate*: Retrieves a random quote or passage
    ![](https://res.cloudinary.com/friendly-social/image/upload/v1604243034/github/random_rpo5aa.png)
    - *!meditate <book_num>:<passage_num>*: Retrieves a specific quote or passage given the book and passage numbers
    ![](https://res.cloudinary.com/friendly-social/image/upload/v1604243034/github/specific_qg4tb3.png)

- Enchiridion **[WIP]**

- Epistulae Morales ad Lucilium (Letters from a Stoic) **[WIP]**

#### Built With:
- [Discord.js](https://discord.js.org/#/)
- [Node.js v12.8.4](https://nodejs.org/en/)

> This project was bootstrapped using the [Discord Bot Boilerplate](https://github.com/scallaway/basic-bot).
