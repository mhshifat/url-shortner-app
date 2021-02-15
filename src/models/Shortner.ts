import { model, Schema } from "mongoose";

const schema = new Schema(
	{
		url: {
			type: String,
			reuired: true,
		},
		shortedUrl: {
			type: String,
			reuired: true,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

export default model("Shortner", schema);
