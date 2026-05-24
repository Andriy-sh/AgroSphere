import { VALID_ROLES, type ValidRole } from "../schemas/register.schema";

export const getRoleFromUrl = (): ValidRole | undefined => {
    if (typeof window === "undefined") {
        return undefined;
    }

    const isStorybook =
        window.location.href.includes("iframe.html") ||
        window.location.href.includes("localhost:6006") ||
        window.location.href.includes("storybook");

    let roleParam: string | null = null;

    if (isStorybook) {
        const url = new URL(window.location.href);
        const pathSegments = url.pathname.split("/");
        const storyName = pathSegments[pathSegments.length - 1];

        if (storyName.includes("farmer")) {
            roleParam = "farmer";
        } else if (storyName.includes("advisor")) {
            roleParam = "advisor";
        } else if (storyName.includes("contractor")) {
            roleParam = "contractor";
        }

        if (!roleParam) {
            const fullPath = window.location.href;
            if (fullPath.includes("farmer")) {
                roleParam = "farmer";
            } else if (fullPath.includes("advisor")) {
                roleParam = "advisor";
            } else if (fullPath.includes("contractor")) {
                roleParam = "contractor";
            }
        }
    } else {
        const search = new URLSearchParams(window.location.search);
        roleParam = search.get("role");
    }

    if (roleParam && VALID_ROLES.includes(roleParam as ValidRole)) {
        return roleParam as ValidRole;
    }

    if (roleParam) {
        return;
    } else {
        return undefined;
    }
};

export const getOrganizationFromUrl = (): string | undefined => {
    if (typeof window === "undefined") {
        return undefined;
    }

    const isStorybook =
        window.location.href.includes("iframe.html") ||
        window.location.href.includes("localhost:6006") ||
        window.location.href.includes("storybook");

    let organizationParam: string | null = null;

    if (isStorybook) {
        const url = new URL(window.location.href);
        const pathSegments = url.pathname.split("/");
        const storyName = pathSegments[pathSegments.length - 1];

        if (storyName.includes("organization")) {
            if (storyName.includes("tech-solutions")) {
                organizationParam = "Tech Solutions Inc.";
            } else if (storyName.includes("farm-services")) {
                organizationParam = "Farm Services Co.";
            } else if (storyName.includes("green-valley")) {
                organizationParam = "Green Valley Farm";
            } else if (storyName.includes("organization")) {
                organizationParam = "Sample Organization";
            }
        }

        if (!organizationParam) {
            const fullPath = window.location.href;
            if (
                fullPath.includes("tech-solutions") ||
                fullPath.includes("techsolutions")
            ) {
                organizationParam = "Tech Solutions Inc.";
            } else if (
                fullPath.includes("farm-services") ||
                fullPath.includes("farmservices")
            ) {
                organizationParam = "Farm Services Co.";
            } else if (
                fullPath.includes("green-valley") ||
                fullPath.includes("greenvalley")
            ) {
                organizationParam = "Green Valley Farm";
            } else if (fullPath.includes("organization")) {
                organizationParam = "Sample Organization";
            }
        }
    } else {
        const search = new URLSearchParams(window.location.search);
        organizationParam = search.get("organization");
    }

    if (organizationParam && organizationParam.trim().length > 0) {
        return organizationParam.trim();
    }

    return undefined;
};

export const getEmailFromUrl = (): string | undefined => {
    if (typeof window === "undefined") {
        return undefined;
    }

    const isStorybook =
        window.location.href.includes("iframe.html") ||
        window.location.href.includes("localhost:6006") ||
        window.location.href.includes("storybook");

    let emailParam: string | null = null;

    if (isStorybook) {
        const url = new URL(window.location.href);
        const pathSegments = url.pathname.split("/");
        const storyName = pathSegments[pathSegments.length - 1];

        if (storyName.includes("farmer")) {
            emailParam = "farmer@greenfields.com";
        } else if (storyName.includes("advisor")) {
            emailParam = "advisor@agritech.com";
        } else if (storyName.includes("contractor")) {
            emailParam = "contractor@farmops.com";
        } else if (storyName.includes("test")) {
            emailParam = "test@example.com";
        } else if (storyName.includes("john")) {
            emailParam = "john.doe@example.com";
        } else if (storyName.includes("sarah")) {
            emailParam = "sarah.advisor@example.com";
        } else if (storyName.includes("mike")) {
            emailParam = "mike.contractor@example.com";
        }

        if (!emailParam) {
            const fullPath = window.location.href;
            if (fullPath.includes("farmer")) {
                emailParam = "farmer@greenfields.com";
            } else if (fullPath.includes("advisor")) {
                emailParam = "advisor@agritech.com";
            } else if (fullPath.includes("contractor")) {
                emailParam = "contractor@farmops.com";
            } else if (fullPath.includes("test")) {
                emailParam = "test@example.com";
            } else if (fullPath.includes("john")) {
                emailParam = "john.doe@example.com";
            } else if (fullPath.includes("sarah")) {
                emailParam = "sarah.advisor@example.com";
            } else if (fullPath.includes("mike")) {
                emailParam = "mike.contractor@example.com";
            }
        }
    } else {
        const search = new URLSearchParams(window.location.search);
        emailParam = search.get("email");
    }

    if (emailParam && emailParam.trim().length > 0) {
        return emailParam.trim();
    }

    return undefined;
};

export const setRoleInUrl = (role: ValidRole, replace = true): void => {
    if (typeof window === "undefined") {
        return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("role", role);

    if (replace) {
        window.history.replaceState({}, "", url.toString());
    } else {
        window.history.pushState({}, "", url.toString());
    }
};

export const setOrganizationInUrl = (organization: string, replace = true): void => {
    if (typeof window === "undefined") {
        return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("organization", organization);

    if (replace) {
        window.history.replaceState({}, "", url.toString());
    } else {
        window.history.pushState({}, "", url.toString());
    }
};

export const removeRoleFromUrl = (replace = true): void => {
    if (typeof window === "undefined") {
        return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("role");

    if (replace) {
        window.history.replaceState({}, "", url.toString());
    } else {
        window.history.pushState({}, "", url.toString());
    }
};

export const removeOrganizationFromUrl = (replace = true): void => {
    if (typeof window === "undefined") {
        return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("organization");

    if (replace) {
        window.history.replaceState({}, "", url.toString());
    } else {
        window.history.pushState({}, "", url.toString());
    }
};

export const hasValidRoleInUrl = (): boolean => {
    const hasRole = getRoleFromUrl() !== undefined;
    return hasRole;
};

export const hasOrganizationInUrl = (): boolean => {
    const hasOrg = getOrganizationFromUrl() !== undefined;
    return hasOrg;
};

export const getAllUrlParams = (): Record<string, string> => {
    if (typeof window === "undefined") {
        return {};
    }

    const search = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};

    for (const [key, value] of search.entries()) {
        params[key] = value;
    }

    return params;
};

export const createRegistrationUrl = (
    role: ValidRole,
    organization?: string,
    baseUrl?: string
): string => {
    const url = new URL(
        baseUrl ||
            (typeof window !== "undefined" ? window.location.origin : "http://localhost")
    );
    url.searchParams.set("role", role);

    if (organization && organization.trim().length > 0) {
        url.searchParams.set("organization", organization.trim());
    }

    const finalUrl = url.toString();

    return finalUrl;
};
