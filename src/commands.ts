import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("saludame")
    .setDescription("El bot te saludará"),
  new SlashCommandBuilder()
    .setName("concursar")
    .setDescription(
      "Apúntate a la increíble y maravillosa lotería navideña de !JustDev"
    )
    .addBooleanOption((option) =>
      option
        .setName("donacion")
        .setDescription(
          "¿Quieres donar tu premio a una nueva escuela de programación?"
        )
    ),
  new SlashCommandBuilder()
    .setName("random")
    .setDescription("Elige un/a ganador/a de la lotería aleatoriamente"),
  new SlashCommandBuilder()
    .setName("he-ganado")
    .setDescription("Consulta si eres el/la ganador/a del concurso"),
].map((command) => command.toJSON());

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);

await rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_ID!), {
  body: commands,
});

console.log("Registered commands");
