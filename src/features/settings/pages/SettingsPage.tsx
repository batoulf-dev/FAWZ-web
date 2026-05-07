/**
 * SettingsPage
 * App settings and preferences
 * Route: /settings
 */

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  ArrowRight,
  Globe,
  Bell,
  FileText,
  MessageSquare,
  CreditCard,
  LogOut,
  ChevronLeft,
  Check,
  Info,
} from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { LANGUAGES, type Language } from '@/core/i18n';
import { useMyProfile } from '@/features/profile/services/profile.service';

export default function SettingsPage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const language = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);
  const logout = useAuthStore((state) => state.logout);

  // Fetch profile for linked accounts info
  const { data: profile } = useMyProfile();

  // Handle back navigation
  const handleBack = (): void => {
    navigate(-1);
  };

  // Handle language change
  const handleLanguageChange = async (lang: Language): Promise<void> => {
    await setLanguage(lang);
  };

  // Handle logout
  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-bg-primary pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-primary border-b border-border-default">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            leftIcon={<ArrowRight className="h-5 w-5 ltr:rotate-180" />}
          />
          <h1 className="text-xl font-bold text-text-primary">
            {t('settings.title')}
          </h1>
        </div>
      </div>

      <div className="py-4 space-y-4">
        {/* Language Section */}
        <Card variant="outlined" padding="none">
          <div className="px-4 py-3 border-b border-border-default">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/10">
                <Globe className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t('settings.language')}
                </p>
                <p className="text-xs text-text-muted">
                  {t('settings.languageDesc')}
                </p>
              </div>
            </div>
          </div>
          <div className="p-2">
            {(Object.entries(LANGUAGES) as [Language, typeof LANGUAGES.ar][]).map(
              ([code, { name }]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                    language === code
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'hover:bg-bg-muted text-text-primary',
                  )}
                >
                  <span className="font-medium">{name}</span>
                  {language === code && <Check className="h-5 w-5" />}
                </button>
              ),
            )}
          </div>
        </Card>

        {/* Linked Accounts Section */}
        <Card variant="outlined" padding="none">
          <div className="px-4 py-3 border-b border-border-default">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-secondary/10">
                <CreditCard className="h-5 w-5 text-brand-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t('settings.linkedAccounts')}
                </p>
                <p className="text-xs text-text-muted">
                  {t('settings.linkedAccountsDesc')}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4">
            {profile?.superqi_user_id ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {t('settings.superQiAccount')}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {t('settings.qiCardLinked')}
                  </p>
                </div>
                <Badge variant="success">
                  <Check className="h-3 w-3 me-1" />
                  {isArabic ? 'مرتبط' : 'Linked'}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-2">
                {t('settings.noLinkedAccounts')}
              </p>
            )}
          </div>
        </Card>

        {/* Quick Links Section */}
        <Card variant="outlined" padding="none">
          {/* Notifications */}
          <SettingsLink
            icon={<Bell className="h-5 w-5 text-warning" />}
            iconBg="bg-warning/10"
            title={t('settings.notifications')}
            description={t('settings.notificationsDesc')}
            onClick={() => navigate('/notifications/settings')}
            showBorder
          />

          {/* Consent */}
          <SettingsLink
            icon={<FileText className="h-5 w-5 text-info" />}
            iconBg="bg-info/10"
            title={t('settings.consent')}
            description={t('settings.consentDesc')}
            onClick={() => navigate('/profile/consent')}
            showBorder
          />

          {/* Disputes */}
          <SettingsLink
            icon={<MessageSquare className="h-5 w-5 text-error" />}
            iconBg="bg-error/10"
            title={t('settings.disputes')}
            description={t('settings.disputesDesc')}
            onClick={() => navigate('/disputes')}
            showBorder={false}
          />
        </Card>

        {/* About Section */}
        <Card variant="outlined" padding="none">
          <SettingsLink
            icon={<Info className="h-5 w-5 text-brand-primary" />}
            iconBg="bg-brand-primary/10"
            title={t('settings.about')}
            description={t('settings.aboutDesc')}
            onClick={() => {}}
            showBorder={false}
            rightContent={
              <span className="text-xs text-text-muted">v1.0.0</span>
            }
          />
        </Card>

        {/* Logout */}
        <Card variant="outlined" padding="none">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 hover:bg-error/5 transition-colors text-start"
          >
            <div className="p-2 rounded-lg bg-error/10">
              <LogOut className="h-5 w-5 text-error" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-error">
                {t('settings.logout')}
              </p>
              <p className="text-xs text-text-muted">
                {t('settings.logoutDesc')}
              </p>
            </div>
          </button>
        </Card>
      </div>
    </div>
  );
}

// Settings link component
interface SettingsLinkProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  onClick: () => void;
  showBorder?: boolean;
  rightContent?: React.ReactNode;
}

function SettingsLink({
  icon,
  iconBg,
  title,
  description,
  onClick,
  showBorder = true,
  rightContent,
}: SettingsLinkProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-4',
        'hover:bg-bg-muted/50 transition-colors text-start',
        showBorder && 'border-b border-border-default',
      )}
    >
      <div className={cn('p-2 rounded-lg', iconBg)}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      {rightContent ?? <ChevronLeft className="h-5 w-5 text-text-muted ltr:rotate-180" />}
    </button>
  );
}
