import React, { FormEvent, KeyboardEvent, useState } from "react";
import { BsTrashFill } from "react-icons/bs";
import { GoPencil } from "react-icons/go";
import useSWR from "swr";
import { deleteShorten, shorten, updateShorten } from "../lib/api/shortner";

const Home = () => {
	const [url, setUrl] = useState("");
	const [showEditInput, setShowEditInput] = useState<string | null>(null);
	const { data: urls, revalidate } = useSWR<any[] | undefined>("/urls");

	const shortenUrl = (e: FormEvent) => {
		e.preventDefault();
		shorten(url)
			.then(() => {
				setUrl("");
				revalidate();
			})
			.catch((err) => console.error(err));
	};

	const updateShortner = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.code === "Enter" && showEditInput) {
			updateShorten(showEditInput, e.currentTarget.value)
				.then(() => {
					setShowEditInput(null);
					revalidate();
				})
				.catch((err) => console.error(err));
		}
	};

	const deleteAShorten = (id: string) => {
		deleteShorten(id)
			.then(() => revalidate())
			.catch((err) => console.error(err));
	};

	return (
		<div className="home">
			<div className="container">
				<h5>Home</h5>
				<h2>Generate short URL</h2>
				<form onSubmit={shortenUrl}>
					<input
						type="text"
						placeholder="Url"
						value={url}
						onChange={({ target }) => setUrl(target.value)}
					/>
					<input type="submit" value="Generate" />
				</form>
				<h2>My URLs</h2>
				{!urls ? (
					<p>Loading...</p>
				) : (
					<table>
						<thead>
							<tr>
								<td>ID</td>
								<td>URL</td>
								<td>Shorted Url</td>
								<td></td>
							</tr>
						</thead>
						<tbody>
							{!urls.length ? (
								<tr>
									<td>No data found...</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							) : (
								urls.map((url) => (
									<tr key={url._id}>
										<td>{url._id}</td>
										<td onDoubleClick={() => setShowEditInput(url._id)}>
											{showEditInput === url._id ? (
												<input
													type="text"
													defaultValue={url.url}
													onKeyPress={updateShortner}
													autoFocus={true}
												/>
											) : (
												(url.url as string).substr(0, 50) + "..."
											)}
										</td>
										<td>
											<a
												target="__blank"
												href={`${process.env.REACT_APP_BASE_URL}/shortne/${url._id}`}
											>
												{url.shortedUrl}
											</a>
										</td>
										<td>
											<GoPencil onClick={() => setShowEditInput(url._id)} />
											<BsTrashFill onClick={() => deleteAShorten(url._id)} />
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default Home;
