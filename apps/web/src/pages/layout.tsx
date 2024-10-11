import FollowMe from "@/components/follow-me";
import Sidebar from "@/components/sidebar";
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Layout({ children } : any) {
    return (
        <>
            <script defer src="https://umami.paulius.pro/script.js"
                    data-website-id="d0f46837-fb44-4c5d-8a9d-7ad980a027a4"></script>
            <GoogleAnalytics gaId="G-3247P7MLM6" />
            <Sidebar>
                <main>{children}</main>

                <FollowMe/>
            </Sidebar>

        </>
    );
}
