'use client';

import {
  SectionHeader,
  PreferenceOption,
  Toggle,
  SettingsTabHeader,
} from '@@agrosphere/shared';
import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';

interface NotificationData {
  email: {
    allEnabled: boolean;
    taskNotifications: boolean;
    reminders: boolean;
    labOrder: boolean;
    comments: boolean;
    subscription: boolean;
    systemUpdates: boolean;
  };
  desktop: {
    allEnabled: boolean;
    taskNotifications: boolean;
    reminders: boolean;
    labOrder: boolean;
  };
}

interface NotificationSettingsProps {
  notificationData?: NotificationData;
  onSave?: (data: NotificationData) => void;
}

export function NotificationSettings({
  notificationData,
  onSave,
}: NotificationSettingsProps) {
  const isInitialRender = useRef(true);
  const previousValues = useRef<NotificationData | null>(null);

  const [emailAllEnabled, setEmailAllEnabled] = useState<boolean>(
    notificationData?.email.allEnabled || false
  );
  const [emailTaskNotifications, setEmailTaskNotifications] = useState<boolean>(
    notificationData?.email.taskNotifications || true
  );
  const [emailReminders, setEmailReminders] = useState<boolean>(
    notificationData?.email.reminders || true
  );
  const [emailLabOrder, setEmailLabOrder] = useState<boolean>(
    notificationData?.email.labOrder || false
  );
  const [emailComments, setEmailComments] = useState<boolean>(
    notificationData?.email.comments || false
  );
  const [emailSubscription, setEmailSubscription] = useState<boolean>(
    notificationData?.email.subscription || true
  );
  const [emailSystemUpdates, setEmailSystemUpdates] = useState<boolean>(
    notificationData?.email.systemUpdates || true
  );

  const [desktopAllEnabled, setDesktopAllEnabled] = useState<boolean>(
    notificationData?.desktop.allEnabled || false
  );
  const [desktopTaskNotifications, setDesktopTaskNotifications] =
    useState<boolean>(
      notificationData?.desktop.taskNotifications || true
    );
  const [desktopReminders, setDesktopReminders] = useState<boolean>(
    notificationData?.desktop.reminders || true
  );
  const [desktopLabOrder, setDesktopLabOrder] = useState<boolean>(
    notificationData?.desktop.labOrder || true
  );

  useEffect(() => {
    if (notificationData) {
      const hasChanged =
        !previousValues.current ||
        JSON.stringify(notificationData) !==
          JSON.stringify(previousValues.current);

      if (hasChanged) {
        setEmailAllEnabled(notificationData.email.allEnabled);
        setEmailTaskNotifications(notificationData.email.taskNotifications);
        setEmailReminders(notificationData.email.reminders);
        setEmailLabOrder(notificationData.email.labOrder);
        setEmailComments(notificationData.email.comments);
        setEmailSubscription(notificationData.email.subscription);
        setEmailSystemUpdates(notificationData.email.systemUpdates);

        setDesktopAllEnabled(notificationData.desktop.allEnabled);
        setDesktopTaskNotifications(notificationData.desktop.taskNotifications);
        setDesktopReminders(notificationData.desktop.reminders);
        setDesktopLabOrder(notificationData.desktop.labOrder);

        previousValues.current = notificationData;
      }
    }
    isInitialRender.current = false;
  }, [notificationData]);

  const allEmailEnabled = useMemo(
    () =>
      emailTaskNotifications &&
      emailReminders &&
      emailLabOrder &&
      emailComments &&
      emailSubscription &&
      emailSystemUpdates,
    [
      emailTaskNotifications,
      emailReminders,
      emailLabOrder,
      emailComments,
      emailSubscription,
      emailSystemUpdates,
    ]
  );

  const allDesktopEnabled = useMemo(
    () => desktopTaskNotifications && desktopReminders && desktopLabOrder,
    [desktopTaskNotifications, desktopReminders, desktopLabOrder]
  );

      useEffect(() => {
    if (!isInitialRender.current) {
      setEmailAllEnabled(allEmailEnabled);
    }
  }, [allEmailEnabled]);

  useEffect(() => {
    if (!isInitialRender.current) {
      setDesktopAllEnabled(allDesktopEnabled);
    }
  }, [allDesktopEnabled]);

  const handleEmailAllToggle = useCallback((enabled: boolean) => {
    setEmailAllEnabled(enabled);

    isInitialRender.current = true;

    if (enabled) {
      setEmailTaskNotifications(true);
      setEmailReminders(true);
      setEmailLabOrder(true);
      setEmailComments(true);
      setEmailSubscription(true);
      setEmailSystemUpdates(true);
    } else {
      setEmailTaskNotifications(false);
      setEmailReminders(false);
      setEmailLabOrder(false);
      setEmailComments(false);
      setEmailSubscription(false);
      setEmailSystemUpdates(false);
    }

    setTimeout(() => {
      isInitialRender.current = false;
    }, 0);
  }, []);

  const handleDesktopAllToggle = useCallback((enabled: boolean) => {
    setDesktopAllEnabled(enabled);

    isInitialRender.current = true;

    if (enabled) {
      setDesktopTaskNotifications(true);
      setDesktopReminders(true);
      setDesktopLabOrder(true);
    } else {
      setDesktopTaskNotifications(false);
      setDesktopReminders(false);
      setDesktopLabOrder(false);
    }

    setTimeout(() => {
      isInitialRender.current = false;
    }, 0);
  }, []);

  useEffect(() => {
    if (notificationData && !isInitialRender.current) {
      const settings: NotificationData = {
        email: {
          allEnabled: emailAllEnabled,
          taskNotifications: emailTaskNotifications,
          reminders: emailReminders,
          labOrder: emailLabOrder,
          comments: emailComments,
          subscription: emailSubscription,
          systemUpdates: emailSystemUpdates,
        },
        desktop: {
          allEnabled: desktopAllEnabled,
          taskNotifications: desktopTaskNotifications,
          reminders: desktopReminders,
          labOrder: desktopLabOrder,
        },
      };


      const hasChanged =
        !previousValues.current ||
        JSON.stringify(settings) !== JSON.stringify(previousValues.current);

      if (hasChanged) {
        previousValues.current = settings;
        onSave?.(settings);
      }
    }
  }, [
    emailAllEnabled,
    emailTaskNotifications,
    emailReminders,
    emailLabOrder,
    emailComments,
    emailSubscription,
    emailSystemUpdates,
    desktopAllEnabled,
    desktopTaskNotifications,
    desktopReminders,
    desktopLabOrder,
    onSave,
    notificationData,
  ]);

  if (!notificationData) {
    return <div>Loading...</div>;
  }

  const emailNotifications = [
    {
      title: 'Task notifications',
      description:
        'Be notified when a task is created, updated, completed, or assigned to you.',
      enabled: emailTaskNotifications,
      onToggle: () => setEmailTaskNotifications(!emailTaskNotifications),
    },
    {
      title: 'Reminders & Deadlines',
      description:
        'Receive reminders for upcoming task deadlines, overdue tasks, or scheduled field activities.',
      enabled: emailReminders,
      onToggle: () => setEmailReminders(!emailReminders),
    },
    {
      title: 'Lab order status',
      description:
        'Get notified when your lab sample is received, processing starts, or results are ready.',
      enabled: emailLabOrder,
      onToggle: () => setEmailLabOrder(!emailLabOrder),
    },
    {
      title: 'Comments & Replies',
      description:
        'Get notified when someone sends comments on a shared item (task etc.).',
      enabled: emailComments,
      onToggle: () => setEmailComments(!emailComments),
    },
    {
      title: 'Subscription & Billing',
      description:
        'Receive updates related to your subscription status, invoices, or billing issues.',
      enabled: emailSubscription,
      onToggle: () => setEmailSubscription(!emailSubscription),
    },
    {
      title: 'System updates',
      description:
        'Stay informed about changes to features, system updates, and important improvements to the platform.',
      enabled: emailSystemUpdates,
      onToggle: () => setEmailSystemUpdates(!emailSystemUpdates),
    },
  ];

  const desktopNotifications = [
    {
      title: 'Task notifications',
      description:
        'Be notified when a task is created, updated, completed, or assigned to you.',
      enabled: desktopTaskNotifications,
      onToggle: () => setDesktopTaskNotifications(!desktopTaskNotifications),
    },
    {
      title: 'Reminders & Deadlines',
      description:
        'Receive reminders for upcoming task deadlines, overdue tasks, or scheduled field activities.',
      enabled: desktopReminders,
      onToggle: () => setDesktopReminders(!desktopReminders),
    },
    {
      title: 'Lab order status',
      description:
        'Get notified when your lab sample is received, processing starts, or results are ready.',
      enabled: desktopLabOrder,
      onToggle: () => setDesktopLabOrder(!desktopLabOrder),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <SettingsTabHeader icon="notifications" title="Notifications" />

      <div className="space-y-5 pb-5">
        <div className="bg-white rounded-xl shadow-sm border border-basic-white">
          <SectionHeader title="Email">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-basic-black">
                Receive all notifications
              </p>
              <Toggle
                checked={emailAllEnabled}
                onCheckedChange={handleEmailAllToggle}
                size="md"
              />
            </div>
          </SectionHeader>
          <div className="p-5">
            <div className="space-y-0">
              {emailNotifications.map((notification, index) => (
                <Fragment key={index}>
                  {index > 0 && (
                    <div className="border-t border-basic-white"></div>
                  )}
                  <div
                    className={
                      index === 0
                        ? 'pb-5'
                        : index === emailNotifications.length - 1
                        ? 'pt-5'
                        : 'py-5'
                    }
                  >
                    <PreferenceOption {...notification} />
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-basic-white">
          <SectionHeader title="Desktop">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-basic-black">
                Receive all notifications
              </p>
              <Toggle
                checked={desktopAllEnabled}
                onCheckedChange={handleDesktopAllToggle}
                size="md"
              />
            </div>
          </SectionHeader>
          <div className="p-5">
            <div className="space-y-0">
              {desktopNotifications.map((notification, index) => (
                <Fragment key={index}>
                  {index > 0 && (
                    <div className="border-t border-basic-white"></div>
                  )}
                  <div
                    className={
                      index === 0
                        ? 'pb-5'
                        : index === desktopNotifications.length - 1
                        ? 'pt-5'
                        : 'py-5'
                    }
                  >
                    <PreferenceOption {...notification} />
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
