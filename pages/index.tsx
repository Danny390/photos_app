import Head from "next/head";
import { Inter } from "next/font/google";
import Hero from "@/components/Hero/Hero";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<>
			<Head>
				<title>Movie Search</title>
			</Head>

			<Hero />
		</>
	);
}
