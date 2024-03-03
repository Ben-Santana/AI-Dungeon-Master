import Image from "next/image";
import Link from "next/link";

export default function SignInButton() {
    return (<div>
        <button className="flex items-center gap-4 custom_bg-light-beige rounded-lg p-4 text-2xl">
            {/* <Image src="/../../public/images/google-logo.png" height={30} width={30} alt="Google Sign In" /> */}
            <span>
                <Link href="/dashboard">Sign in with Google</Link>
            </span>
        </button>
    </div>
    );
}