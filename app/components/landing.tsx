import Link from "next/link";

export default function Landing() {
    return <>
        <nav>
            <Link href="/dashboard" className="text-2xl">Dashboard</Link>
        </nav>
    </>
}