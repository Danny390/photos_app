import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
import styles from "./Cart.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { PhotosInterface } from "../Hero/Hero";
import { IoTrashBinOutline } from "react-icons/io5";
interface Props {
	wishList: PhotosInterface[];
	setWishList: Dispatch<SetStateAction<PhotosInterface[]>>;
	setShowCart: Dispatch<SetStateAction<boolean>>;
}

const Cart = ({ wishList, setWishList, setShowCart }: Props) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setIsVisible(true);
		document.body.classList.add("no-scroll");

		return () => {
			document.body.classList.remove("no-scroll");
		};
	}, []);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			setIsVisible(false);
			setShowCart(false);
			document.body.classList.remove("no-scroll");
		}, 300);
	};

	const handleRemove = async (photoId: number) => {
		setWishList((state) => state.filter((entry) => entry.id !== photoId));
	};

	const handleRemoveAll = async () => {
		if (!wishList || wishList.length === 0) return;

		setWishList([]);
	};

	const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (
			containerRef.current &&
			!containerRef.current.contains(event.target as Node)
		) {
			handleClose();
		}
	};

	const jsx = useMemo(() => {
		if (!wishList) return;

		const linesJSX: JSX.Element[] = [];

		let i = 0;
		for (const line of wishList) {
			linesJSX.push(
				<div className={styles.cartItem} key={line.id}>
					<Image
						alt=""
						src={line.thumbnailUrl}
						width={150}
						height={150}
					/>
					<div className={styles.details}>
						<p>{line.title}</p>
					</div>
					<button
						onClick={() => handleRemove(line.id)}
						className={styles.removeButton}
					>
						<IoTrashBinOutline />
					</button>
				</div>
			);
			i++;
		}

		return (
			<div
				className={`${styles.overlay} ${
					isVisible && !isClosing ? styles.show : ""
				} ${isClosing ? styles.hide : ""}`}
				onClick={handleOverlayClick}
			>
				<div
					ref={containerRef}
					className={`${styles.container} ${
						isVisible && !isClosing ? styles.show : ""
					} ${isClosing ? styles.hide : ""}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className={styles.header}>
						<h2>Wish List</h2>
					</div>
					<div className={styles.items}>
						{linesJSX.length === 0 ? (
							<div
								style={{ userSelect: "none" }}
								className={styles.cartItem}
								key={"empty"}
							>
								No Items in Wish List
							</div>
						) : (
							linesJSX
						)}
						{linesJSX.length > 0 && (
							<div className={styles.total}>
								{linesJSX.length > 1 && (
									<b
										style={{ cursor: "pointer" }}
										onClick={() => handleRemoveAll()}
									>
										Remove All
									</b>
								)}
							</div>
						)}
					</div>
					<div className={styles.navigation}>
						<span
							style={{
								margin:
									wishList.length === 0 ? "0.75rem 0rem" : 0
							}}
							onClick={handleClose}
						>
							← Go back
						</span>
					</div>
				</div>
			</div>
		);
	}, [wishList, isVisible, isClosing]);

	return !jsx ? <p>Loading...</p> : jsx;
};

export default Cart;
