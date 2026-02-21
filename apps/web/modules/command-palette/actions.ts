import type { ActionDefinition } from "modifywithai";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import type { ActionMutations } from "./useActionMutations";

/**
 * Canonical shared actions array for better-cmdk + modifywithai.
 *
 * - No `inputSchema` → better-cmdk-owned (direct command execution)
 * - Has `inputSchema` → modifywithai-owned (agentic argument collection)
 *
 * One array, one source of truth. Do not duplicate.
 */
export function buildActions(
  router: AppRouterInstance,
  t: (key: string) => string,
  mutations: ActionMutations,
  publicPageUrl: string
): ActionDefinition[] {
  return [
    // ──────────────────────────────────────
    // Navigation — Main sections
    // ──────────────────────────────────────
    {
      name: "go-to-event-types",
      label: t("event_types_page_title"),
      description: "Navigate to event types",
      group: "Navigation",
      keywords: ["event", "types", "links"],
      shortcut: "E T",
      execute: () => router.push("/event-types"),
    },
    {
      name: "go-to-upcoming-bookings",
      label: t("upcoming"),
      description: "View upcoming bookings",
      group: "Navigation",
      keywords: ["upcoming", "bookings", "calendar"],
      shortcut: "U B",
      execute: () => router.push("/bookings/upcoming"),
    },
    {
      name: "go-to-recurring-bookings",
      label: t("recurring"),
      description: "View recurring bookings",
      group: "Navigation",
      keywords: ["recurring", "bookings", "repeat"],
      shortcut: "R B",
      execute: () => router.push("/bookings/recurring"),
    },
    {
      name: "go-to-past-bookings",
      label: t("past"),
      description: "View past bookings",
      group: "Navigation",
      keywords: ["past", "bookings", "history"],
      shortcut: "P B",
      execute: () => router.push("/bookings/past"),
    },
    {
      name: "go-to-cancelled-bookings",
      label: t("cancelled"),
      description: "View cancelled bookings",
      group: "Navigation",
      keywords: ["cancelled", "bookings"],
      shortcut: "C B",
      execute: () => router.push("/bookings/cancelled"),
    },
    {
      name: "go-to-availability",
      label: t("availability"),
      description: "Manage availability schedules",
      group: "Navigation",
      keywords: ["schedule", "availability", "hours"],
      shortcut: "S A",
      execute: () => router.push("/availability"),
    },
    {
      name: "go-to-teams",
      label: t("teams"),
      description: "View and manage teams",
      group: "Navigation",
      keywords: ["teams", "manage", "members"],
      shortcut: "T S",
      execute: () => router.push("/teams"),
    },
    {
      name: "go-to-apps",
      label: t("app_store"),
      description: "Browse the app store",
      group: "Navigation",
      keywords: ["apps", "integrations", "store", "marketplace"],
      shortcut: "A S",
      execute: () => router.push("/apps"),
    },
    {
      name: "go-to-installed-apps",
      label: t("installed_apps"),
      description: "View installed apps",
      group: "Navigation",
      keywords: ["installed", "apps", "integrations", "connected"],
      execute: () => router.push("/apps/installed/calendar"),
    },
    {
      name: "go-to-workflows",
      label: t("workflows"),
      description: "Manage automation workflows",
      group: "Navigation",
      keywords: ["workflows", "automation"],
      shortcut: "W F",
      execute: () => router.push("/workflows"),
    },
    {
      name: "go-to-routing",
      label: t("routing"),
      description: "Manage routing forms",
      group: "Navigation",
      keywords: ["routing", "forms", "rules"],
      execute: () => router.push("/routing"),
    },
    {
      name: "go-to-insights",
      label: t("insights"),
      description: "View analytics and insights",
      group: "Navigation",
      keywords: ["insights", "analytics", "reports", "data"],
      execute: () => router.push("/insights"),
    },

    // ──────────────────────────────────────
    // Navigation — Settings
    // ──────────────────────────────────────
    {
      name: "go-to-profile",
      label: t("profile"),
      description: "Edit your profile settings",
      group: "Navigation",
      keywords: ["profile", "settings", "name", "bio"],
      shortcut: "P S",
      execute: () => router.push("/settings/my-account/profile"),
    },
    {
      name: "go-to-general-settings",
      label: t("general"),
      description: "General account settings",
      group: "Navigation",
      keywords: ["general", "settings", "timezone", "language", "locale"],
      execute: () => router.push("/settings/my-account/general"),
    },
    {
      name: "go-to-appearance",
      label: t("appearance"),
      description: "Customize appearance and branding",
      group: "Navigation",
      keywords: ["appearance", "theme", "brand", "color", "dark", "light"],
      execute: () => router.push("/settings/my-account/appearance"),
    },
    {
      name: "go-to-calendars",
      label: t("calendars"),
      description: "Manage connected calendars",
      group: "Navigation",
      keywords: ["calendars", "connected", "google", "outlook"],
      execute: () => router.push("/settings/my-account/calendars"),
    },
    {
      name: "go-to-conferencing",
      label: t("conferencing"),
      description: "Manage conferencing apps",
      group: "Navigation",
      keywords: ["conferencing", "video", "zoom", "meet", "teams"],
      execute: () => router.push("/settings/my-account/conferencing"),
    },
    {
      name: "go-to-out-of-office",
      label: t("out_of_office"),
      description: "Set out of office dates",
      group: "Navigation",
      keywords: ["out of office", "vacation", "ooo", "away"],
      execute: () => router.push("/settings/my-account/out-of-office"),
    },
    {
      name: "go-to-password-security",
      label: t("change_password"),
      description: "Change your password",
      group: "Navigation",
      keywords: ["password", "security", "change"],
      shortcut: "C P",
      execute: () => router.push("/settings/security/password"),
    },
    {
      name: "go-to-two-factor",
      label: t("two_factor_auth"),
      description: "Manage two-factor authentication",
      group: "Navigation",
      keywords: ["two factor", "authentication", "2fa", "totp"],
      shortcut: "T F A",
      execute: () => router.push("/settings/security/two-factor-auth"),
    },
    {
      name: "go-to-impersonation",
      label: t("user_impersonation_heading"),
      description: "Manage user impersonation settings",
      group: "Navigation",
      keywords: ["impersonation", "user"],
      shortcut: "U I",
      execute: () => router.push("/settings/security/impersonation"),
    },
    {
      name: "go-to-webhooks",
      label: "Webhooks",
      description: "Manage webhooks",
      group: "Navigation",
      keywords: ["webhooks", "automation", "developer"],
      shortcut: "W H",
      execute: () => router.push("/settings/developer/webhooks"),
    },
    {
      name: "go-to-api-keys",
      label: t("api_keys"),
      description: "Manage API keys",
      group: "Navigation",
      keywords: ["api", "keys", "developer", "tokens"],
      shortcut: "A P I",
      execute: () => router.push("/settings/developer/api-keys"),
    },
    {
      name: "go-to-billing",
      label: t("manage_billing"),
      description: "View and manage billing",
      group: "Navigation",
      keywords: ["billing", "subscription", "payment", "plan"],
      shortcut: "M B",
      execute: () => router.push("/settings/billing"),
    },
    {
      name: "go-to-teams-settings",
      label: t("teams"),
      description: "Team management settings",
      group: "Navigation",
      keywords: ["teams", "settings", "manage"],
      execute: () => router.push("/settings/teams"),
    },

    // ──────────────────────────────────────
    // UI / Preferences
    // ──────────────────────────────────────
    {
      name: "toggle-dark-mode",
      label: "Toggle Dark Mode",
      description: "Switch between light and dark theme",
      group: "UI / Preferences",
      keywords: ["dark", "light", "theme", "mode", "appearance", "toggle"],
      execute: () => {
        document.documentElement.classList.toggle("dark");
      },
    },
    {
      name: "change-timezone",
      label: t("timezone"),
      description: "Go to timezone settings",
      group: "UI / Preferences",
      keywords: ["timezone", "change", "modify", "time", "zone"],
      shortcut: "C T",
      execute: () => router.push("/settings/my-account/general"),
    },
    {
      name: "change-avatar",
      label: t("change_avatar"),
      description: "Update your profile avatar",
      group: "UI / Preferences",
      keywords: ["avatar", "profile", "picture", "photo", "change"],
      shortcut: "C A",
      execute: () => router.push("/settings/my-account/profile"),
    },
    {
      name: "change-brand-color",
      label: t("brand_color"),
      description: "Customize your brand color",
      group: "UI / Preferences",
      keywords: ["brand", "color", "customize", "appearance"],
      shortcut: "B C",
      execute: () => router.push("/settings/my-account/appearance"),
    },

    // ──────────────────────────────────────
    // Help / Utilities
    // ──────────────────────────────────────
    {
      name: "open-help",
      label: "Help Center",
      description: "Open the Cal.com help center",
      group: "Help / Utilities",
      keywords: ["help", "support", "docs", "documentation", "faq"],
      execute: () => window.open("https://cal.com/help", "_blank"),
    },
    {
      name: "open-docs",
      label: "Developer Docs",
      description: "Open the Cal.com developer documentation",
      group: "Help / Utilities",
      keywords: ["docs", "developer", "api", "documentation"],
      execute: () => window.open("https://cal.com/docs", "_blank"),
    },
    {
      name: "copy-booking-link",
      label: "Copy Booking Link",
      description: "Copy your personal booking page URL",
      group: "Help / Utilities",
      keywords: ["copy", "link", "share", "booking", "url"],
      execute: () => {
        navigator.clipboard.writeText(publicPageUrl);
        // toast is shown by the shell's own copy action; keep consistent
      },
    },

    // ──────────────────────────────────────
    // Data — argument-requiring (modifywithai owned)
    // ──────────────────────────────────────
    {
      name: "create-event-type",
      label: "Create Event Type",
      description: "Create a new event type with a title and duration",
      group: "Data",
      keywords: ["create", "new", "event", "type", "add"],
      inputSchema: {
        title: { type: "string", description: "Event type title", required: true },
        slug: { type: "string", description: "URL slug for the event type", required: false },
        duration: { type: "number", description: "Duration in minutes (default: 30)", required: false },
        description: { type: "string", description: "Event type description", required: false },
      },
      approvalRequired: true,
      execute: mutations.createEventType,
    },
    {
      name: "cancel-booking",
      label: "Cancel Booking",
      description: "Cancel an existing booking by its UID",
      group: "Data",
      keywords: ["cancel", "booking", "remove"],
      inputSchema: {
        uid: { type: "string", description: "Booking uid from the bookings context data", required: true },
        reason: { type: "string", description: "Cancellation reason (required when you are the host)", required: true },
      },
      approvalRequired: true,
      execute: mutations.cancelBooking,
    },
    {
      name: "reschedule-booking",
      label: "Request Reschedule",
      description: "Send a reschedule request for an existing booking",
      group: "Data",
      keywords: ["reschedule", "booking", "move", "change", "time"],
      inputSchema: {
        uid: { type: "string", description: "Booking uid from the bookings context data", required: true },
        reason: { type: "string", description: "Reason for rescheduling", required: false },
      },
      approvalRequired: true,
      execute: mutations.requestReschedule,
    },
    {
      name: "create-team",
      label: "Create Team",
      description: "Create a new team",
      group: "Data",
      keywords: ["create", "new", "team", "add"],
      inputSchema: {
        name: { type: "string", description: "Team name", required: true },
      },
      approvalRequired: true,
      execute: mutations.createTeam,
    },
    {
      name: "invite-team-member",
      label: "Invite Team Member",
      description: "Invite a new member to a team",
      group: "Data",
      keywords: ["invite", "member", "team", "add", "user"],
      inputSchema: {
        teamId: { type: "number", description: "Team ID", required: true },
        email: { type: "string", description: "Email address to invite", required: true },
        role: { type: "string", description: "Role: MEMBER, ADMIN, or OWNER", required: false },
      },
      approvalRequired: true,
      execute: mutations.inviteTeamMember,
    },
    {
      name: "create-webhook",
      label: "Create Webhook",
      description: "Create a new webhook subscription",
      group: "Data",
      keywords: ["create", "webhook", "automation"],
      inputSchema: {
        subscriberUrl: { type: "string", description: "Webhook endpoint URL", required: true },
        eventTriggers: {
          type: "string",
          description: "Comma-separated event triggers (e.g. BOOKING_CREATED,BOOKING_CANCELLED)",
          required: true,
        },
      },
      approvalRequired: true,
      execute: mutations.createWebhook,
    },
    {
      name: "create-schedule",
      label: "Create Schedule",
      description: "Create a new availability schedule",
      group: "Data",
      keywords: ["create", "new", "schedule", "availability"],
      inputSchema: {
        name: { type: "string", description: "Schedule name", required: true },
      },
      approvalRequired: true,
      execute: mutations.createSchedule,
    },
    {
      name: "create-workflow",
      label: "Create Workflow",
      description: "Create a new automation workflow and navigate to its editor",
      group: "Data",
      keywords: ["create", "new", "workflow", "automation"],
      inputSchema: {
        name: { type: "string", description: "Workflow name", required: true },
      },
      approvalRequired: true,
      execute: () => router.push("/workflows/new"),
    },
    {
      name: "create-api-key",
      label: "Create API Key",
      description: "Generate a new API key",
      group: "Data",
      keywords: ["create", "api", "key", "token", "developer"],
      inputSchema: {
        note: { type: "string", description: "Note or description for the API key", required: false },
        expiresInDays: { type: "number", description: "Days until expiration (default: never)", required: false },
      },
      approvalRequired: true,
      execute: mutations.createApiKey,
    },
    {
      name: "update-profile",
      label: "Update Profile",
      description: "Update your profile information",
      group: "Data",
      keywords: ["update", "profile", "name", "bio"],
      inputSchema: {
        name: { type: "string", description: "Display name", required: false },
        bio: { type: "string", description: "Bio/description", required: false },
        username: { type: "string", description: "Username/slug", required: false },
      },
      execute: mutations.updateProfile,
    },
    {
      name: "create-out-of-office",
      label: "Set Out of Office",
      description: "Create an out-of-office entry with a future date range. Dates must be in the future — use currentDateTime from context to resolve relative dates like 'next week' or 'January 5'.",
      group: "Data",
      keywords: ["out of office", "ooo", "vacation", "away"],
      inputSchema: {
        startDate: { type: "string", description: "Start date (YYYY-MM-DD)", required: true },
        endDate: { type: "string", description: "End date (YYYY-MM-DD)", required: true },
        notes: { type: "string", description: "Optional note about why you're out of office", required: false },
      },
      approvalRequired: true,
      execute: mutations.createOutOfOffice,
    },
    {
      name: "create-routing-form",
      label: "Create Routing Form",
      description: "Open the routing form builder to create a new form",
      group: "Data",
      keywords: ["create", "routing", "form"],
      inputSchema: {
        name: { type: "string", description: "Form name", required: true },
      },
      approvalRequired: true,
      execute: () => router.push("/routing/new"),
    },
  ];
}
