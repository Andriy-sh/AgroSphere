import React, { useEffect, useState } from "react";
import {
    getRoleFromUrl,
    getOrganizationFromUrl,
    getAllUrlParams,
    createRegistrationUrl,
    setRoleInUrl,
    setOrganizationInUrl,
    removeRoleFromUrl,
    removeOrganizationFromUrl
} from "../utils/url-params";
import { VALID_ROLES, type ValidRole } from "../schemas/register.schema";

interface UrlDemoProps {
    className?: string;
}

export const UrlDemo: React.FC<UrlDemoProps> = ({ className = "" }) => {
    const [currentUrl, setCurrentUrl] = useState<string>("");
    const [extractedData, setExtractedData] = useState({
        role: undefined as ValidRole | undefined,
        organization: undefined as string | undefined,
        allParams: {} as Record<string, string>
    });

    const [urlInput, setUrlInput] = useState("");
    const [customRole, setCustomRole] = useState("");
    const [customOrganization, setCustomOrganization] = useState("");

    const [demoUrls] = useState([
        {
            name: "Farmer Registration",
            url: "http://localhost:3000/register?role=farmer",
            description: "Farmer registration"
        },
        {
            name: "Advisor with Organization",
            url: "http://localhost:3000/register?role=advisor&organization=Tech Solutions Inc.",
            description: "Advisor registration with organization"
        },
        {
            name: "Contractor Registration",
            url: "http://localhost:3000/register?role=contractor&organization=Farm Services Co.",
            description: "Contractor registration with organization"
        },
        {
            name: "Invalid Role",
            url: "http://localhost:3000/register?role=invalid",
            description: "Example with invalid role"
        },
        {
            name: "No Parameters",
            url: "http://localhost:3000/register",
            description: "URL without parameters"
        }
    ]);

    const updateExtractedData = () => {
        const role = getRoleFromUrl();
        const organization = getOrganizationFromUrl();
        const allParams = getAllUrlParams();

        setExtractedData({
            role,
            organization,
            allParams
        });

        setCurrentUrl(window.location.href);
    };

    useEffect(() => {
        updateExtractedData();

        const handleUrlChange = () => {
            updateExtractedData();
        };

        window.addEventListener("popstate", handleUrlChange);

        return () => {
            window.removeEventListener("popstate", handleUrlChange);
        };
    }, []);

    const handleUrlClick = (url: string) => {
        window.history.pushState({}, "", url);
        updateExtractedData();
    };

    const handleSetRole = (role: ValidRole) => {
        setRoleInUrl(role);
        updateExtractedData();
    };

    const handleSetOrganization = (org: string) => {
        setOrganizationInUrl(org);
        updateExtractedData();
    };

    const handleRemoveRole = () => {
        removeRoleFromUrl();
        updateExtractedData();
    };

    const handleRemoveOrganization = () => {
        removeOrganizationFromUrl();
        updateExtractedData();
    };

    const handleCreateRegistrationUrl = () => {
        const url = createRegistrationUrl("farmer", "Demo Organization");
        alert(`Created URL: ${url}`);
    };
    const handleLoadCustomUrl = () => {
        if (urlInput.trim()) {
            try {
                const url = new URL(urlInput);
                window.history.pushState({}, "", url.pathname + url.search);
                updateExtractedData();
                setUrlInput("");
            } catch (error) {
                alert("Invalid URL format. Please enter a valid URL.");
            }
        }
    };

    const handleSetCustomData = () => {
        const params = new URLSearchParams();

        if (customRole.trim()) {
            params.set("role", customRole.trim());
        }
        if (customOrganization.trim()) {
            params.set("organization", customOrganization.trim());
        }

        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.pushState({}, "", newUrl);
        updateExtractedData();

        // Clear inputs
        setCustomRole("");
        setCustomOrganization("");
    };

    const handleClearAll = () => {
        window.history.pushState({}, "", window.location.pathname);
        updateExtractedData();
        setCustomRole("");
        setCustomOrganization("");
        setUrlInput("");
    };

    return (
        <div className={`p-6 bg-gray-50 rounded-lg ${className}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">URL Parameters Demo</h2>

            <div className="mb-6 p-4 bg-white rounded border">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Insert URL Data:</h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Load Custom URL:</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={urlInput}
                            onChange={e => setUrlInput(e.target.value)}
                            placeholder="Enter full URL (e.g., http://localhost:3000/register?role=farmer)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleLoadCustomUrl}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Load URL
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Set Custom Parameters:</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Role:</label>
                            <select
                                value={customRole}
                                onChange={e => setCustomRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select role</option>
                                {VALID_ROLES.map(role => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                                <option value="invalid">invalid (for testing)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Organization:</label>
                            <input
                                type="text"
                                value={customOrganization}
                                onChange={e => setCustomOrganization(e.target.value)}
                                placeholder="Enter organization name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSetCustomData}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                            Set Parameters
                        </button>
                        <button onClick={handleClearAll} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-6 p-4 bg-white rounded border">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Current URL:</h3>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">{currentUrl || "Loading..."}</div>
            </div>

            <div className="mb-6 p-4 bg-white rounded border">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Extracted Data:</h3>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <span className="font-medium w-32">Role:</span>
                        <span
                            className={`px-2 py-1 rounded text-sm ${
                                extractedData.role ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {extractedData.role || "Not found"}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-medium w-32">Organization:</span>
                        <span
                            className={`px-2 py-1 rounded text-sm ${
                                extractedData.organization ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {extractedData.organization || "Not found"}
                        </span>
                    </div>
                    <div className="flex items-start">
                        <span className="font-medium w-32">All Params:</span>
                        <pre className="bg-gray-100 p-2 rounded text-xs flex-1 overflow-x-auto">
                            {JSON.stringify(extractedData.allParams, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Demo URLs:</h3>
                <div className="space-y-3">
                    {demoUrls.map((demo, index) => (
                        <div key={index} className="p-3 bg-white rounded border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-800">{demo.name}</h4>
                                <button
                                    onClick={() => handleUrlClick(demo.url)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                >
                                    Load URL
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{demo.description}</p>
                            <div className="bg-gray-100 p-2 rounded font-mono text-xs break-all">{demo.url}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">URL Manipulation:</h3>

                <div className="mb-4 p-3 bg-white rounded border">
                    <h4 className="font-medium mb-2 text-gray-700">Role Controls:</h4>
                    <div className="flex flex-wrap gap-2">
                        {VALID_ROLES.map(role => (
                            <button
                                key={role}
                                onClick={() => handleSetRole(role)}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                            >
                                Set {role}
                            </button>
                        ))}
                        <button
                            onClick={handleRemoveRole}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        >
                            Remove Role
                        </button>
                    </div>
                </div>

                <div className="mb-4 p-3 bg-white rounded border">
                    <h4 className="font-medium mb-2 text-gray-700">Organization Controls:</h4>
                    <div className="flex flex-wrap gap-2">
                        {["Tech Solutions Inc.", "Farm Services Co.", "Green Valley Farm"].map(org => (
                            <button
                                key={org}
                                onClick={() => handleSetOrganization(org)}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                            >
                                Set {org}
                            </button>
                        ))}
                        <button
                            onClick={handleRemoveOrganization}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        >
                            Remove Organization
                        </button>
                    </div>
                </div>

                <div className="p-3 bg-white rounded border">
                    <h4 className="font-medium mb-2 text-gray-700">Create Registration URL:</h4>
                    <button
                        onClick={handleCreateRegistrationUrl}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                    >
                        Create Demo Registration URL
                    </button>
                </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="text-lg font-semibold mb-2 text-yellow-800">Console Logs:</h3>
                <p className="text-sm text-yellow-700">
                    Open browser console (F12) to see detailed logs from URL utilities. Each action will be logged with the "[URL Utils]" prefix.
                </p>
            </div>
        </div>
    );
};
