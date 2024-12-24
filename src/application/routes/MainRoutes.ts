import { HttpRoute } from "@/core/http/Routing";
import AuthProxyController from "@/application/modules/auth/AuthModule";

const MainRoutes: HttpRoute[] = [
    {
        pattern: "/auth/proxy",
        method: "POST",
        callback: AuthProxyController.execute.bind(AuthProxyController)
    }
]

export default MainRoutes;