import Landing from "./components/landing";
import UserInfo from "./components/userInfo";

export default function LandingPage() {
    return <>
        <div className="grid place-items-center h-screen">
            <UserInfo></UserInfo>
        </div>
    </>
}