import FollowMe from "@/components/follow-me";
import Sidebar from "@/components/sidebar";

export default function Layout({ children } : any) {
    return (
        <>
            <Sidebar />
            <main>{children}</main>

            <FollowMe />
        </>
    );
}
