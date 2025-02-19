import { FlowJVForm, flowSchema, SubmitButton } from "flowjv-react-material";
import { AutoFlow, FormSpy } from "flowjv-react";
import React, { useState } from "react";

interface IData {
	personalDetails: {
		name: string;
		password: string;
		confirmPassword: string;
		gender: "male" | "female";
		array: { obj?: string; subarray?: { subobj?: string }[] }[];
	};
	acceptTerms: boolean;
}
const schema = flowSchema<IData>({
	type: "object",
	properties: [
		{
			key: "personalDetails",
			type: "object",
			properties: [
				{
					type: "string",
					key: "name",
					validations: [
						{
							logic: [">=", ["str:len", ["$ref"]], 3],
							err: "Length should be minimum of 3.",
						},
					],

					label: "Name",
				},
				{
					key: "somuraju",
					type: "string",
					label: "Somu Raju",
					ui: {
						autoFocus: true,
					},
				},
				{
					key: "password",
					type: "string",
					validations: [
						{
							logic: [">=", ["str:len", ["$ref"]], 3],
							err:
								"Password should be minimum of 3 character length.",
						},
					],

					label: "Password",
					ui: {
						type: "password",
					},
				},
				{
					key: "confirmPassword",
					type: "string",
					validations: [
						{
							logic: [
								"===",
								["$ref"],
								["$data", "personalDetails.password"],
							],
							err: "Password and confirm password should match.",
						},
					],

					label: "Confirm Password",
					ui: {
						type: "password",
					},
				},
				{
					key: "gender",
					type: "enum",
					items: [
						{ value: "male", label: "Male" },
						{ value: "female", label: "Female" },
					],

					label: "Gender",
					ui: {
						type: "radio",
					},
				},
				{
					key: "array",
					type: "array",
					label: "Array",
					// length: 3,

					itemSchema: {
						type: "object",
						properties: [
							// { key: "obj", type: "string" },
							{
								key: "subarray",
								type: "array",
								label: "SubArray",
								// length: 3,
								itemSchema: {
									type: "object",
									properties: [
										{
											key: "subobj",
											type: "string",
											label: "Sub Object",
											isRequired: true,
											errMsgs: {
												required:
													"Value for subobj is required!",
											},
										},
									],
								},
							},
						],
					},
				},
			],
		},
		{
			key: "acceptTerms",
			type: "boolean",
			validations: [
				{
					logic: ["===", ["$ref"], true],
					err: "Please accept terms and conditions",
				},
			],

			label: "Accept terms and conditions",
		},
	],
});
export default function Builder() {
	const [args, setArgs] = useState({});
	return (
		<FlowJVForm<IData, {}>
			schema={schema}
			onSubmit={(args) => {
				setArgs(args);
			}}
			initialData={{
				personalDetails: {
					name: "Kishore",
					password: "hello",
					confirmPassword: "hello",
					gender: "male",
					array: [{ subarray: [{}, {}, {}] }],
				},
			}}
			renderMap={{
				"personalDetails.name": (args) => {
					if (
						args.type !== "simple" ||
						args.schema.type !== "string"
					) {
						return null;
					}
					const {
						schema,
						onTouch,
						touched,
						errors,
						registerRef,
						value,
						setValue,
						path,
					} = args;
					return (
						<div>
							<label>Kishore</label>
							<input
								onFocus={() => onTouch(true)}
								value={value ?? ""}
								onChange={(e) => {
									setValue(
										["personalDetails", "somuraju"],
										e.target.value
									);
									setValue(path, e.target.value);
								}}
								style={{ padding: 10 }}
								type={schema.ui?.type ?? "text"}
								ref={(r) =>
									registerRef({
										setFocus: () => r?.focus(),
									})
								}
							/>
							{touched && errors && (
								<div>{errors.join(" ]n ")}</div>
							)}
						</div>
					);
				},
			}}
		>
			<div className="mx-auto flex justify-center">
				<div className="bg-gray-100 p-5 shadow-2xl max-w-md w-full">
					<h1 className="text-2xl">Form!</h1>
					<AutoFlow path="personalDetails" />
					<AutoFlow path="acceptTerms" />
					<SubmitButton />
				</div>
				<div className="w-full max-w-md">
					<FormSpy>
						{({ data }) => (
							<pre className="mt-3 p-4 bg-gray-500 text-white">
								{JSON.stringify(data, null, "  ")}
							</pre>
						)}
					</FormSpy>
				</div>
			</div>
		</FlowJVForm>
	);
}
