import Link from "next/link";

export default function Home() {
	return (
		<main className='block md:flex flex-col justify-center items-center h-screen'>
			<h1 className='text-5xl font-bold'>Hello World</h1>
			<div className='block md:flex  mt-12 gap-4'>
				<Link
					className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
					href='/chart-one'
				>
					Chart One
				</Link>
				<Link
					className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
					href='/chart-two'
				>
					Chart Two
				</Link>
				<Link
					className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
					href='/chart-three'
				>
					Chart Three
				</Link>
			</div>
		</main>
	);
}
