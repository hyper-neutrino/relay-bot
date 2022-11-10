import Parent from './index.js';
import * as autocomplete from '../../lib/autocomplete.js';
import * as util from '../../lib/util.js';

Parent.subcommand({
  name: 'name-mode',
  description: 'changes the name mode of a global channel',
  options: [{
    type: 3,
    name: 'name',
    description: 'the name of the global channel you want to change the name mode of',
    required: true,
    autocomplete: true,
    onAutocomplete: autocomplete.global,
  }, {
    type: 5,
    name: 'usernames',
    description: 'true to use usernames; false to use display names (nicknames)',
  }],
}, async interaction => {
  const reply = content => interaction.reply({ content, ephemeral: true });

  const tcnData = await util.getTCNData(interaction);
  if (!tcnData.observer) return reply('Sorry, only TCN execs can do that');
  
  const global = await interaction.client.db.Global.findOne({ name: interaction.options.getString('name') });
  if (!global) return reply('Sorry, that is not a global channel');

  const usernames = interaction.options.getBoolean('usernames');
  
  await global.updateOne({ usernames });
  await reply(`name mode for ${global.name} changed to ${usernames ? 'usernames' : 'display names'}`);

  util.log(util.fakeMessage(interaction, {
    content: `${interaction.user} changed ${channel} to use ${usernames ? 'usernames' : 'display names'}`,
  }), util.tags.edit, global).catch(() => {});
});