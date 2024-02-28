import Link from "next/link";

export default function NavBar() {
    return <nav className="p-4 flex justify-between custom_bg-dark-gray text-white">
        <Link href="/" className="text-3xl">Artificers Construct</Link>
        <button className="text-2xl custom_bg-gray pt-2 pb-2 pl-4 pr-4 rounded-md">Sign In</button>
    </nav>
}