"use client";

import { MembershipRole, CreationSource, WebhookTriggerEvents } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import type { TUpdateProfileInputSchema } from "@calcom/trpc/server/routers/viewer/me/updateProfile.schema";
import { showToast } from "@calcom/ui/components/toast";

export interface ActionMutations {
  createEventType: (args: Record<string, unknown>) => Promise<void>;
  cancelBooking: (args: Record<string, unknown>) => Promise<void>;
  requestReschedule: (args: Record<string, unknown>) => Promise<void>;
  createTeam: (args: Record<string, unknown>) => Promise<void>;
  inviteTeamMember: (args: Record<string, unknown>) => Promise<void>;
  createWebhook: (args: Record<string, unknown>) => Promise<void>;
  createSchedule: (args: Record<string, unknown>) => Promise<void>;
  createApiKey: (args: Record<string, unknown>) => Promise<void>;
  updateProfile: (args: Record<string, unknown>) => Promise<void>;
  createOutOfOffice: (args: Record<string, unknown>) => Promise<void>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function useActionMutations(): ActionMutations {
  const createEventTypeMutation = trpc.viewer.eventTypesHeavy.create.useMutation();
  const requestRescheduleMutation = trpc.viewer.bookings.requestReschedule.useMutation();
  const createTeamMutation = trpc.viewer.teams.create.useMutation();
  const inviteTeamMemberMutation = trpc.viewer.teams.inviteMember.useMutation();
  const createWebhookMutation = trpc.viewer.webhook.create.useMutation();
  const createScheduleMutation = trpc.viewer.availability.schedule.create.useMutation();
  const createApiKeyMutation = trpc.viewer.apiKeys.create.useMutation();
  const updateProfileMutation = trpc.viewer.me.updateProfile.useMutation();
  const createOOOMutation = trpc.viewer.ooo.outOfOfficeCreateOrUpdate.useMutation();

  return {
    createEventType: async (args) => {
      const title = String(args.title || "");
      const slug = String(args.slug || "") || slugify(title);
      const duration = Number(args.duration) || 30;
      const description = args.description ? String(args.description) : null;
      await createEventTypeMutation.mutateAsync({
        title,
        slug,
        length: duration,
        description,
      });
      showToast(`Event type "${title}" created`, "success");
    },

    cancelBooking: async (args) => {
      const uid = String(args.uid || "");
      const reason = args.reason ? String(args.reason) : undefined;
      const csrfRes = await fetch("/api/csrf?sameSite=none", { cache: "no-store" });
      const { csrfToken } = await csrfRes.json();
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, cancellationReason: reason, csrfToken }),
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      showToast("Booking cancelled", "success");
    },

    requestReschedule: async (args) => {
      const bookingUid = String(args.uid || "");
      const reason = args.reason ? String(args.reason) : undefined;
      await requestRescheduleMutation.mutateAsync({
        bookingUid,
        rescheduleReason: reason,
      });
      showToast("Reschedule request sent", "success");
    },

    createTeam: async (args) => {
      const name = String(args.name || "");
      await createTeamMutation.mutateAsync({
        name,
        slug: slugify(name),
      });
      showToast(`Team "${name}" created`, "success");
    },

    inviteTeamMember: async (args) => {
      const teamId = Number(args.teamId);
      const email = String(args.email || "");
      const roleStr = String(args.role || "MEMBER");
      const roleMap: Record<string, MembershipRole> = {
        MEMBER: MembershipRole.MEMBER,
        ADMIN: MembershipRole.ADMIN,
        OWNER: MembershipRole.OWNER,
      };
      const role = roleMap[roleStr] ?? MembershipRole.MEMBER;
      await inviteTeamMemberMutation.mutateAsync({
        teamId,
        usernameOrEmail: email,
        role,
        language: "en",
        creationSource: CreationSource.WEBAPP,
      });
      showToast(`Invitation sent to ${email}`, "success");
    },

    createWebhook: async (args) => {
      const subscriberUrl = String(args.subscriberUrl || "");
      const triggers = String(args.eventTriggers || "BOOKING_CREATED");
      const validTriggers = new Set<string>(Object.values(WebhookTriggerEvents));
      const eventTriggers = triggers
        .split(",")
        .map((t) => t.trim())
        .filter((t): t is WebhookTriggerEvents => validTriggers.has(t));
      await createWebhookMutation.mutateAsync({
        subscriberUrl,
        eventTriggers,
        active: true,
        payloadTemplate: null,
      });
      showToast("Webhook created", "success");
    },

    createSchedule: async (args) => {
      const name = String(args.name || "");
      await createScheduleMutation.mutateAsync({ name });
      showToast(`Schedule "${name}" created`, "success");
    },

    createApiKey: async (args) => {
      const note = args.note ? String(args.note) : null;
      const days = args.expiresInDays ? Number(args.expiresInDays) : undefined;
      const expiresAt = days ? new Date(Date.now() + days * 86400000) : null;
      await createApiKeyMutation.mutateAsync({
        note,
        expiresAt,
        neverExpires: !expiresAt,
      });
      showToast("API key created", "success");
    },

    updateProfile: async (args) => {
      const updates: TUpdateProfileInputSchema = {};
      if (args.name) updates.name = String(args.name);
      if (args.bio) updates.bio = String(args.bio);
      if (args.username) updates.username = String(args.username);
      await updateProfileMutation.mutateAsync(updates);
      showToast("Profile updated", "success");
    },

    createOutOfOffice: async (args) => {
      const startDate = new Date(String(args.startDate));
      const endDate = new Date(String(args.endDate));
      const notes = args.notes ? String(args.notes) : null;
      await createOOOMutation.mutateAsync({
        dateRange: { startDate, endDate },
        startDateOffset: -1 * startDate.getTimezoneOffset(),
        endDateOffset: -1 * endDate.getTimezoneOffset(),
        toTeamUserId: null,
        reasonId: 1,
        notes,
      });
      showToast("Out of office entry created", "success");
    },
  };
}
