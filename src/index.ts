import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import axios from "axios";

type User = {
  id: number;
  userId: string;
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  switch (interaction.commandName) {
    case "saludame":
      await interaction.reply({
        content: "Holi! 🎄",
        ephemeral: true,
      });
      break;
    case "concursar": {
      const userId = interaction.user.id;

      await axios.post(`${process.env.API_URL}/participants`, {
        userId,
      });

      await interaction.reply({
        content: "¡Te has inscrito en el concurso, suerte! 🤶",
        ephemeral: true,
      });

      break;
    }

    case "random": {
      const { data: participants } = await axios.get<User[]>(
        `${process.env.API_URL}/participants`
      );
      const userIds = participants.map((userData) => userData.userId);
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];

      await axios.post(`${process.env.API_URL}/winners`, {
        userId: randomUserId,
      });

      await interaction.reply({
        content: `Ya ha sido escogido un/a ganador/a: ${randomUserId}`,
        ephemeral: true,
      });

      break;
    }

    case "he-ganado": {
      const userId = interaction.user.id;

      const { data: winners } = await axios.get<User[]>(
        `${process.env.API_URL}/winners`
      );

      await interaction.reply({
        content: winners.some((user) => user.userId === userId)
          ? "¡Te has ganado un abrazo! 🎅"
          : "¡Oooooh, sigue intentándolo! 🧑‍🎄",
        ephemeral: true,
      });

      break;
    }

    default:
  }
});

await client.login(process.env.DISCORD_BOT_TOKEN);
