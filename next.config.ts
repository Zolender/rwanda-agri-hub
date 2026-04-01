import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
    serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
};

export default withSentryConfig(nextConfig, {
    org: "agrihub",
    project: "agrihub",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    disableLogger: true,
    sourcemaps: {
        deleteSourcemapsAfterUpload: true,
    },
});