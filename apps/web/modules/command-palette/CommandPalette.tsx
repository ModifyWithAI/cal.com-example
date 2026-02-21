"use client";

import { CommandMenu } from "better-cmdk";
import { SearchIcon } from "lucide-react";
import { useAssistant } from "modifywithai";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getBookerBaseUrlSync } from "@calcom/features/ee/organizations/lib/getBookerBaseUrlSync";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { isMac } from "@calcom/lib/isMac";
import { trpc } from "@calcom/trpc/react";
import useMeQuery from "@calcom/trpc/react/hooks/useMeQuery";
import { Tooltip } from "@calcom/ui/components/tooltip";

import { buildActions } from "./actions";
import { useActionMutations } from "./useActionMutations";

function useAppContext() {
  const { data: me } = useMeQuery();

  // Event types — listWithTeam includes personal + team event types
  const { data: eventTypes } = trpc.viewer.eventTypes.listWithTeam.useQuery(undefined, {
    staleTime: 5 * 60_000,
  });
  const { data: schedules } = trpc.viewer.availability.list.useQuery(undefined, {
    staleTime: 5 * 60_000,
  });
  const { data: teams } = trpc.viewer.teams.list.useQuery(undefined, { staleTime: 5 * 60_000 });
  const { data: webhooks } = trpc.viewer.webhook.list.useQuery(undefined, { staleTime: 5 * 60_000 });

  // Bookings — upcoming, unconfirmed, and recent past
  const { data: upcomingBookings } = trpc.viewer.bookings.get.useQuery(
    { filters: { status: "upcoming" }, limit: 20 },
    { staleTime: 60_000 }
  );
  const { data: unconfirmedBookings } = trpc.viewer.bookings.get.useQuery(
    { filters: { status: "unconfirmed" }, limit: 20 },
    { staleTime: 60_000 }
  );
  const { data: pastBookings } = trpc.viewer.bookings.get.useQuery(
    { filters: { status: "past" }, limit: 10 },
    { staleTime: 5 * 60_000 }
  );
  const { data: cancelledBookings } = trpc.viewer.bookings.get.useQuery(
    { filters: { status: "cancelled" }, limit: 10 },
    { staleTime: 5 * 60_000 }
  );

  // Out of office entries
  const { data: oooEntries } = trpc.viewer.ooo.outOfOfficeEntriesList.useInfiniteQuery(
    { limit: 20 },
    { staleTime: 5 * 60_000, getNextPageParam: (last) => last.nextCursor }
  );

  // Connected calendars and conferencing
  const { data: connectedCalendars } = trpc.viewer.calendars.connectedCalendars.useQuery(undefined, {
    staleTime: 5 * 60_000,
  });
  const { data: defaultConferencingApp } = trpc.viewer.apps.getUsersDefaultConferencingApp.useQuery(
    undefined,
    { staleTime: 5 * 60_000 }
  );

  // Installed apps (only installed ones)
  const { data: installedApps } = trpc.viewer.apps.integrations.useQuery(
    { onlyInstalled: true },
    { staleTime: 5 * 60_000 }
  );

  // Workflows
  const { data: workflows } = trpc.viewer.workflows.filteredList.useQuery(null, {
    staleTime: 5 * 60_000,
  });

  const mapBookings = (bookings: typeof upcomingBookings) =>
    bookings?.bookings?.map((b) => ({
      id: b.id,
      uid: b.uid,
      title: b.title,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status,
      attendees: b.attendees?.map((a) => ({ name: a.name, email: a.email })),
      eventType: b.eventType ? { id: b.eventType.id, title: b.eventType.title } : null,
    })) ?? null;

  return useMemo(
    () => ({
      user: me
        ? {
            id: me.id,
            username: me.username,
            name: me.name,
            email: me.email,
            timeZone: me.timeZone,
            locale: me.locale,
            timeFormat: me.timeFormat,
            weekStart: me.weekStart,
            organizationId: me.organizationId,
            organization: me.organization ? { slug: me.organization.slug } : null,
            defaultScheduleId: me.defaultScheduleId,
            completedOnboarding: me.completedOnboarding,
            isPremium: me.isPremium,
          }
        : null,
      eventTypes:
        eventTypes?.map((et) => ({
          id: et.id,
          title: et.title,
          slug: et.slug,
          length: et.length,
          team: et.team,
          username: et.username,
        })) ?? null,
      schedules:
        schedules?.schedules?.map((s) => ({
          id: s.id,
          name: s.name,
          isDefault: s.isDefault,
          timeZone: s.timeZone,
        })) ?? null,
      teams: teams?.map((t) => ({ id: t.id, name: t.name, slug: t.slug, role: t.role })) ?? null,
      upcomingBookings: mapBookings(upcomingBookings),
      unconfirmedBookings: mapBookings(unconfirmedBookings),
      pastBookings: mapBookings(pastBookings),
      cancelledBookings: mapBookings(cancelledBookings),
      webhooks:
        webhooks?.map((w) => ({
          id: w.id,
          subscriberUrl: w.subscriberUrl,
          active: w.active,
          eventTriggers: w.eventTriggers,
        })) ?? null,
      outOfOffice:
        oooEntries?.pages?.flatMap((p) =>
          p.rows.map((e) => ({
            id: e.id,
            start: e.start,
            end: e.end,
            notes: e.notes,
            reason: e.reason?.emoji ? `${e.reason.emoji} ${e.reason.reason}` : null,
          }))
        ) ?? null,
      connectedCalendars:
        connectedCalendars?.connectedCalendars?.map((c) => ({
          integration: c.integration ? { title: c.integration.title, type: c.integration.type } : null,
          primary: c.primary,
          calendars: c.calendars?.map((cal) => ({
            name: cal.name,
            externalId: cal.externalId,
            isSelected: cal.isSelected,
            readOnly: cal.readOnly,
          })),
        })) ?? null,
      destinationCalendar: connectedCalendars?.destinationCalendar ?? null,
      defaultConferencingApp: defaultConferencingApp ?? null,
      installedApps:
        installedApps?.items?.map((app) => ({
          name: app.name,
          type: app.type,
          slug: app.slug,
          category: app.category,
          installed: app.installed,
        })) ?? null,
      workflows:
        workflows?.filteredList?.map((w) => ({
          id: w.id,
          name: w.name,
          active: w.active,
          trigger: w.trigger,
          time: w.time,
          timeUnit: w.timeUnit,
        })) ?? null,
    }),
    [
      me,
      eventTypes,
      schedules,
      teams,
      webhooks,
      upcomingBookings,
      unconfirmedBookings,
      pastBookings,
      cancelledBookings,
      oooEntries,
      connectedCalendars,
      defaultConferencingApp,
      installedApps,
      workflows,
    ]
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useLocale();

  const mutations = useActionMutations();
  const appContext = useAppContext();
  const publicPageUrl = `${getBookerBaseUrlSync(appContext.user?.organization?.slug ?? null)}/${appContext.user?.username ?? ""}`;
  const actions = buildActions(router, t, mutations, publicPageUrl);

  const assistant = useAssistant({
    actions,
    getContext: () => ({
      currentPage: window.location.pathname,
      currentDateTime: new Date().toISOString(),
      ...appContext,
    }),
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandMenu open={open} onOpenChange={setOpen} actions={actions} chat={assistant} />
  );
}

export function CommandPaletteTrigger() {
  const [, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const tooltipContent = isMac ? "\u2318 + K" : "CTRL + K";

  return (
    <Tooltip side="right" content={tooltipContent}>
      <button
        color="minimal"
        onClick={() => {
          // Dispatch the same keyboard shortcut to toggle the palette
          document.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              ctrlKey: !isMac,
              bubbles: true,
            })
          );
        }}
        className="todesktop:hover:!bg-transparent group flex rounded-md px-3 py-2 font-medium text-default text-sm transition hover:bg-subtle lg:px-2 lg:hover:bg-emphasis lg:hover:text-emphasis">
        <SearchIcon className="h-4 w-4 shrink-0 text-inherit" />
      </button>
    </Tooltip>
  );
}
