/**
 * SCR-005: Winner Share Screen
 * Share winning card on social media
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Share2, Gift, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { ErrorState } from '@/shared/components/ErrorState';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { formatCurrency, formatLocalizedDate, DATE_FORMAT_PRESETS } from '@/core/utils/formatters';
import toast from 'react-hot-toast';

// Winner share card component (pre-rendered for sharing)
function WinnerShareCard({
  entryNumber,
  prizeAmount,
  tier,
  drawDate,
  matchingDigits,
}: {
  entryNumber: string;
  prizeAmount: number;
  tier: string;
  drawDate: string;
  matchingDigits: number;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const digits = entryNumber.split('');

  return (
    <div
      id="share-card"
      className="bg-gradient-to-br from-brand-gold via-brand-gold to-brand-primary p-6 rounded-2xl text-white"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
          <Trophy className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold mb-1">🎉 {t('share.iWon')}</h1>
        <p className="text-sm opacity-80">{t('share.withFawz')}</p>
      </div>

      {/* Prize Amount */}
      <div className="bg-white/10 rounded-xl p-4 mb-4 text-center">
        <p className="text-4xl font-bold mb-1">{formatCurrency(prizeAmount, lang)}</p>
        <p className="text-sm opacity-80">{tier}</p>
      </div>

      {/* Winning Number */}
      <div className="mb-4">
        <p className="text-sm text-center mb-2 opacity-80">
          {t('share.myWinningNumber')}
        </p>
        <div className="flex justify-center gap-1 rtl:flex-row-reverse">
          {digits.map((digit, idx) => {
            const isMatching = idx >= digits.length - matchingDigits;
            return (
              <div
                key={idx}
                className={`
                  w-7 h-10 flex items-center justify-center
                  rounded-lg text-lg font-bold
                  ${isMatching
                    ? 'bg-white text-brand-gold'
                    : 'bg-white/20 text-white'
                  }
                `}
              >
                {digit}
              </div>
            );
          })}
        </div>
      </div>

      {/* Draw Date */}
      <div className="flex items-center justify-center gap-2 text-sm opacity-80 mb-4">
        <Calendar className="h-4 w-4" />
        <span>{drawDate}</span>
      </div>

      {/* Fawz Branding */}
      <div className="text-center pt-4 border-t border-white/20">
        <p className="text-lg font-bold">FAWZ</p>
        <p className="text-xs opacity-60">{t('share.downloadNow')}</p>
      </div>
    </div>
  );
}

export default function WinnerSharePage(): React.ReactElement {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useNetworkStatus();

  usePageTitle(t('share.shareYourWin'));

  // Get win data from location state or params
  const winData = location.state as {
    entryNumber?: string;
    prizeAmount?: number;
    tier?: string;
    drawDate?: string;
    matchingDigits?: number;
  } | null;

  // Mock data if not provided (for demo)
  const shareData = {
    entryNumber: winData?.entryNumber ?? '1234567890',
    prizeAmount: winData?.prizeAmount ?? 10000,
    tier: winData?.tier ?? 'Last-3',
    drawDate: winData?.drawDate ?? formatLocalizedDate(new Date(), DATE_FORMAT_PRESETS.full, lang),
    matchingDigits: winData?.matchingDigits ?? 3,
  };

  const handleShare = async () => {
    try {
      // Create share data
      const shareText = `🎉 ${t('share.iWon')} ${formatCurrency(shareData.prizeAmount, lang)} ${t('share.withFawz')}!\n\n${t('share.joinNow')}`;

      if (navigator.share) {
        await navigator.share({
          title: t('share.shareTitle'),
          text: shareText,
          // In production, include share card image URL
        });
        toast.success(t('share.sharedSuccess'));
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success(t('share.copiedToClipboard'));
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error(t('share.shareFailed'));
      }
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `🎉 ${t('share.iWon')} ${formatCurrency(shareData.prizeAmount, lang)} ${t('share.withFawz')}!\n\n${t('share.joinNow')}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (!isOnline) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('share.offlineMessage')}
          onRetry={undefined}
        />
      </div>
    );
  }

  return (
    <div className="bg-surface-primary">
      <div className="py-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowRight className="h-4 w-4 ltr:rotate-180" />
            {t('common:back')}
          </button>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {t('share.shareYourWin')}
          </h1>
          <p className="text-text-secondary">
            {t('share.shareWithFriends')}
          </p>
        </div>

        {/* Share Card Preview */}
        <WinnerShareCard
          entryNumber={shareData.entryNumber}
          prizeAmount={shareData.prizeAmount}
          tier={shareData.tier}
          drawDate={shareData.drawDate}
          matchingDigits={shareData.matchingDigits}
        />

        {/* Share Actions */}
        <div className="space-y-3">
          <Button onClick={handleShare} className="w-full">
            <Share2 className="h-5 w-5 me-2" />
            {t('share.shareNow')}
          </Button>

          <Button
            variant="outline"
            onClick={handleWhatsAppShare}
            className="w-full text-green-600 border-green-600 hover:bg-green-50"
          >
            <svg className="h-5 w-5 me-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('share.shareWhatsApp')}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-border-primary">
          <button
            onClick={() => navigate('/prizes')}
            className="w-full text-center text-brand-primary font-medium py-2"
          >
            <Gift className="h-5 w-5 inline me-2" />
            {t('share.viewPrizeDetails')}
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full text-center text-text-secondary py-2"
          >
            {t('share.backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
}
