import FollowMe from "@/components/follow-me";
import Sidebar from "@/components/sidebar";

export default function Layout({ children } : any) {
    return (
        <>
            <script defer src="https://umami.paulius.pro/script.js"
                    data-website-id="d0f46837-fb44-4c5d-8a9d-7ad980a027a4"></script>
            <Sidebar>
                <main>{children}</main>

                <FollowMe/>
            </Sidebar>

        </>
    );
}
