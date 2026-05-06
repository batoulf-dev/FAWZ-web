/**
 * ShariaDisclosureModal
 * SCR-015: Sharia Disclosure Modal
 * Auto-triggered on first Fawz tab open if sharia_disclosure_accepted=false
 */

import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { useAcceptShariaDisclosure } from '../index';

interface ShariaDisclosureModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export function ShariaDisclosureModal({
  isOpen,
  onAccept,
  onClose,
}: ShariaDisclosureModalProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const acceptMutation = useAcceptShariaDisclosure();

  const handleAccept = (): void => {
    acceptMutation.mutate(undefined, {
      onSuccess: () => {
        onAccept();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('consent.shariaTitle')}
      size="md"
      closeOnOverlayClick={false}
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-brand-primary/10 text-brand-primary">
            <FileText className="h-10 w-10" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <p className="text-text-primary text-lg font-medium">
            {isArabic ? 'إفصاح شرعي' : 'Sharia Disclosure'}
          </p>

          <div className="bg-bg-muted rounded-lg p-4">
            <p className="text-text-secondary text-sm leading-relaxed">
              {t('consent.shariaBody')}
            </p>
          </div>

          {/* Arabic legal text */}
          {isArabic && (
            <p className="text-xs text-text-muted">
              فوز هي برنامج مكافآت تجارية حصرية لعملاء سوبر كي. الأرقام تُمنح مقابل
              المعاملات المالية الفعلية وليس مقابل مبالغ نقدية.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleAccept}
            isLoading={acceptMutation.isPending}
          >
            {t('consent.shariaAccept')}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={acceptMutation.isPending}
          >
            {t('consent.shariaClose')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
