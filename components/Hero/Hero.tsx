import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Hero.module.scss";
import Image from "next/image";
import { CiCirclePlus, CiShoppingCart, CiSquareRemove } from "react-icons/ci";
import Cart from "../Cart/Cart";

export interface PhotosInterface {
	albumId: number;
	id: number;
	thumbnailUrl: string;
	title: string;
	url: string;
}

const Hero = () => {
	const [photos, setPhotos] = useState<PhotosInterface[] | undefined>(
		undefined
	);

	const [wishList, setWishList] = useState<PhotosInterface[]>([]);

	const [gettingData, setGettingData] = useState(false);

	const getPhotoData = async () => {
		try {
			setGettingData(true);
			const data = await fetch(
				"https://jsonplaceholder.typicode.com/albums/1/photos"
			).then((response) => response.json());

			if (data) {
				setPhotos(data);
			}

			setGettingData(false);
		} catch (error) {
			setPhotos([]);
			setGettingData(false);
			console.error(error);
		}
	};

	useEffect(() => {
		getPhotoData();
	}, []);

	const [searchString, setSearchString] = useState("");

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchString(e.target.value);
	};

	const photosJSX = useMemo(() => {
		if (!photos || photos.length === 0) return;

		const jsx: JSX.Element[] = [];

		const usedPhotos = searchString
			? photos.filter((entry) => entry.title.includes(searchString))
			: photos;

		let key = 0;
		for (const photo of usedPhotos) {
			let addedToWishList = false;

			for (const item of wishList) {
				if (item.id === photo.id) {
					addedToWishList = true;
					break;
				}
			}
			jsx.push(
				<div className={styles.photo} key={key}>
					<b>{photo.title}</b>

					<Image
						alt=""
						src={photo.thumbnailUrl}
						width={150}
						height={150}
					/>
					{addedToWishList ? (
						<CiSquareRemove
							onClick={() =>
								setWishList((state) =>
									state.filter(
										(entry) => entry.id !== photo.id
									)
								)
							}
						/>
					) : (
						<CiCirclePlus
							onClick={() =>
								setWishList((state) => [...state, photo])
							}
						/>
					)}
				</div>
			);
		}

		return jsx;
	}, [photos, wishList, searchString]);

	const [showNavbarCart, setShowCart] = useState(false);

	return (
		<div className={styles.container}>
			{showNavbarCart && (
				<Cart
					wishList={wishList}
					setWishList={setWishList}
					setShowCart={setShowCart}
				/>
			)}
			<CiShoppingCart
				onClick={() => setShowCart(true)}
				className={styles.cart}
			/>
			{wishList.length > 0 && (
				<b
					onClick={() => setShowCart(true)}
					className={styles.wishNumber}
				>
					{wishList.length}
				</b>
			)}

			<h2>Welcome to the Movie Search App</h2>

			{gettingData ? (
				<p style={{ marginTop: "1rem" }}>Fetching Data...</p>
			) : photos && photos.length === 0 ? (
				<p style={{ marginTop: "1rem" }}>Failed to fetch photos :(</p>
			) : (
				<>
					<input
						type="text"
						placeholder="Search titles..."
						autoComplete="off"
						onInput={handleChange}
						value={searchString}
					/>
					<div className={styles.photoContainer}>{photosJSX}</div>
				</>
			)}
		</div>
	);
};

export default Hero;
