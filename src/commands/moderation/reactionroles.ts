import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import { RRManager } from '../../lib/modules/classes/RRManager';
import { reaction_roles_model } from '../../lib/models/reaction_roles';

export default new Command({
  name: 'reactionrole',
  description: 'リアクションロールの設定を行います',
  ephemeral: true,
  requiredPermissions: ['ManageGuild', 'ManageRoles'],
  options: [
    {
      name: 'create',
      description: 'リアクションロールを作成しパネルを設定します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'panel_id',
          description: 'パネルの識別名',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'title',
          description: 'パネルのタイトル',
          type: ApplicationCommandOptionType.String,
        },
        {
          name: 'description',
          description: 'パネルの説明("//"で改行)',
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
    {
      name: 'remove',
      description: 'リアクションロールを削除します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'panel_id',
          description: 'パネルの識別名',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },
    {
      name: 'add',
      description: 'ロールを追加します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'panel_id',
          description: 'パネルの識別名',
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: true,
        },
        {
          name: 'role',
          description: '追加するロール',
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
        {
          name: 'label',
          description: '表示名',
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
    {
      name: 'delete',
      description: 'ロールを削除します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'panel_id',
          description: 'パネルの識別名',
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: true,
        },
        {
          name: 'role',
          description: '削除するロール',
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
  ],
  execute: {
    autoComplete: async ({ client, interaction }) => {
      const option = interaction.options.getFocused(true);
      if (option.name === 'panel_id') {
        const reaction_roles = await reaction_roles_model.find({
          GuildID: interaction.guild?.id,
        });
        if (!reaction_roles) return;

        await interaction.respond(
          reaction_roles.map((data) => {
            return {
              name: data.RRID,
              value: data.RRID,
            };
          })
        );
      }
    },
    interaction: async ({ client, interaction }) => {
      const ReactionRole = new RRManager(interaction);
      const rr_id = interaction.options.getString('panel_id', true);

      const role = interaction.options.getRole('role');

      switch (interaction.options.getSubcommand()) {
        case 'create':
          const title = interaction.options.getString('title');
          const description = interaction.options.getString('description');

          await ReactionRole.create(rr_id, {
            title,
            description,
          });
          break;
        case 'remove':
          await ReactionRole.remove(rr_id);
          break;
        case 'add':
          if (!role) return;
          const label = interaction.options.getString('label');

          await ReactionRole.roles.add(rr_id, {
            role,
            label,
          });
          break;
        case 'delete':
          if (!role) return;
          await ReactionRole.roles.delete(rr_id, role);
          break;
      }

      await ReactionRole.refresh(rr_id);
    },
  },
});
