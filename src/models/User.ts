import { model, Schema } from "mongoose";

const schema = new Schema(
	{
		email: {
			type: String,
			reuired: true,
		},
		password: {
			type: String,
			reuired: true,
		},
	},
	{ timestamps: true }
);

export default model("User", schema);
