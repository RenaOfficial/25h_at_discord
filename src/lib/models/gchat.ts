import { model, Schema } from 'mongoose';

const gchat_model = model(
  'gchat',
  new Schema({
    GuildID: {
      type: String,
      required: true,
    },
    ChannelID: {
      type: String,
      required: true,
    },
  })
);

export { gchat_model };
