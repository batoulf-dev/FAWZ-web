/**
 * Help Page
 * Information about how Fawz works, rules, prize tiers, and draw schedules
 */

import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  Ticket,
  Trophy,
  Calendar,
  Gift,
  ShieldCheck,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/shared/components/Card';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { cn } from '@/core/utils/cn';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, icon, children, defaultOpen = false }: AccordionItemProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-start hover:bg-bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
            {icon}
          </div>
          <span className="font-semibold text-text-primary">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <CardContent className="pt-0 pb-4 px-4">
          <div className="ps-11 text-text-secondary text-sm leading-relaxed space-y-3">
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function HelpPage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  usePageTitle(t('navigation.help'));

  return (
    <div className="bg-surface-primary">
      <div className="py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">
            {t('navigation.help')}
          </h1>
          <HelpCircle className="h-6 w-6 text-brand-primary" />
        </div>

        {/* Introduction */}
        <Card className="bg-gradient-to-br from-brand-primary/10 to-brand-gold/10">
          <CardContent className="p-4">
            <h2 className="font-bold text-lg text-text-primary mb-2">
              {isArabic ? 'مرحباً بك في فوز!' : 'Welcome to Fawz!'}
            </h2>
            <p className="text-text-secondary text-sm">
              {isArabic
                ? 'فوز هو برنامج مكافآت يمنحك فرصة للفوز بجوائز نقدية من خلال معاملاتك اليومية عبر سوبر كي.'
                : 'Fawz is a rewards program that gives you a chance to win cash prizes through your daily transactions via Super Qi.'}
            </p>
          </CardContent>
        </Card>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {/* How to Get Tickets */}
          <AccordionItem
            title={isArabic ? 'كيف تحصل على أرقام فوز؟' : 'How to Get Fawz Numbers'}
            icon={<Ticket className="h-5 w-5" />}
            defaultOpen
          >
            <p>
              {isArabic
                ? 'تحصل على أرقام فوز تلقائياً عند إجراء معاملات عبر سوبر كي:'
                : 'You earn Fawz numbers automatically when you make transactions via Super Qi:'}
            </p>
            <ul className="list-disc list-inside space-y-1.5 ps-2">
              <li>{isArabic ? 'دفع الفواتير' : 'Bill payments'}</li>
              <li>{isArabic ? 'شحن الرصيد' : 'Top-ups'}</li>
              <li>{isArabic ? 'المشتريات عبر نقاط البيع' : 'POS purchases'}</li>
              <li>{isArabic ? 'الدفع عبر رمز QR' : 'QR code payments'}</li>
              <li>{isArabic ? 'التحويلات' : 'Transfers'}</li>
            </ul>
            <p className="mt-2">
              {isArabic
                ? 'يمكنك أيضاً كسب أرقام إضافية من خلال التحديات والإحالات!'
                : 'You can also earn bonus numbers through challenges and referrals!'}
            </p>
          </AccordionItem>

          {/* How to Win */}
          <AccordionItem
            title={isArabic ? 'كيف تفوز؟' : 'How to Win'}
            icon={<Trophy className="h-5 w-5" />}
          >
            <p>
              {isArabic
                ? 'في كل سحب، يتم اختيار رقم فائز عشوائياً. إذا تطابقت أرقام فوز الخاصة بك مع الرقم الفائز، تفوز بجائزة!'
                : 'In each draw, a winning number is randomly selected. If your Fawz numbers match the winning number, you win a prize!'}
            </p>
            <p>
              {isArabic
                ? 'كلما زاد عدد الأرقام المتطابقة، زادت قيمة الجائزة.'
                : 'The more digits that match, the bigger your prize.'}
            </p>
          </AccordionItem>

          {/* Prize Tiers */}
          <AccordionItem
            title={isArabic ? 'مستويات الجوائز' : 'Prize Tiers'}
            icon={<Gift className="h-5 w-5" />}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-border-default">
                <span>{isArabic ? 'آخر 3 أرقام' : 'Last 3 digits'}</span>
                <span className="font-semibold text-brand-gold">5,000 IQD</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border-default">
                <span>{isArabic ? 'آخر 5 أرقام' : 'Last 5 digits'}</span>
                <span className="font-semibold text-brand-gold">50,000 IQD</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border-default">
                <span>{isArabic ? 'آخر 7 أرقام' : 'Last 7 digits'}</span>
                <span className="font-semibold text-brand-gold">500,000 IQD</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border-default">
                <span>{isArabic ? 'آخر 10 أرقام (الجائزة الكبرى)' : 'Last 10 digits (Jackpot)'}</span>
                <span className="font-semibold text-brand-gold">10,000,000 IQD</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-muted">
              {isArabic
                ? '* قد تختلف قيم الجوائز. راجع شروط وأحكام السحب الحالي.'
                : '* Prize values may vary. Check current draw terms and conditions.'}
            </p>
          </AccordionItem>

          {/* Draw Schedule */}
          <AccordionItem
            title={isArabic ? 'جدول السحوبات' : 'Draw Schedule'}
            icon={<Calendar className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-text-primary mb-1">
                  {isArabic ? 'السحب الأسبوعي' : 'Weekly Draw'}
                </h4>
                <p>
                  {isArabic
                    ? 'كل يوم أربعاء الساعة 8:00 مساءً بتوقيت بغداد'
                    : 'Every Wednesday at 8:00 PM Baghdad time'}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {isArabic
                    ? 'يتم بث السحب مباشرة على قناة الرابعة'
                    : 'Broadcast live on Al-Rabiaa TV'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">
                  {isArabic ? 'السحب الشهري' : 'Monthly Draw'}
                </h4>
                <p>
                  {isArabic
                    ? 'آخر أربعاء من كل شهر الساعة 8:00 مساءً بتوقيت بغداد'
                    : 'Last Wednesday of each month at 8:00 PM Baghdad time'}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {isArabic
                    ? 'جوائز أكبر وفرص إضافية للفوز!'
                    : 'Bigger prizes and extra chances to win!'}
                </p>
              </div>
            </div>
          </AccordionItem>

          {/* Rules */}
          <AccordionItem
            title={isArabic ? 'القواعد والشروط' : 'Rules & Terms'}
            icon={<ShieldCheck className="h-5 w-5" />}
          >
            <ul className="list-disc list-inside space-y-2 ps-2">
              <li>
                {isArabic
                  ? 'يجب أن يكون عمرك 18 عاماً أو أكثر للمشاركة'
                  : 'You must be 18 years or older to participate'}
              </li>
              <li>
                {isArabic
                  ? 'أرقام فوز صالحة للسحب التالي فقط بعد كسبها'
                  : 'Fawz numbers are valid for the next draw after being earned'}
              </li>
              <li>
                {isArabic
                  ? 'يتم إيداع الجوائز تلقائياً في محفظة سوبر كي الخاصة بك'
                  : 'Prizes are automatically deposited to your Super Qi wallet'}
              </li>
              <li>
                {isArabic
                  ? 'لا يمكن استبدال أو تحويل أرقام فوز'
                  : 'Fawz numbers cannot be exchanged or transferred'}
              </li>
              <li>
                {isArabic
                  ? 'قرارات السحب نهائية وغير قابلة للاستئناف'
                  : 'Draw decisions are final and cannot be appealed'}
              </li>
            </ul>
          </AccordionItem>

          {/* Weekly Spark */}
          <AccordionItem
            title={isArabic ? 'شرارة الأسبوع' : 'Weekly Spark'}
            icon={<Clock className="h-5 w-5" />}
          >
            <p>
              {isArabic
                ? 'اكسب أرقام فوز إضافية من خلال إجراء معاملات في 5 أيام مختلفة خلال الأسبوع!'
                : 'Earn bonus Fawz numbers by making transactions on 5 different days during the week!'}
            </p>
            <ul className="list-disc list-inside space-y-1.5 ps-2 mt-2">
              <li>
                {isArabic
                  ? 'قم بمعاملة واحدة على الأقل يومياً'
                  : 'Make at least one transaction per day'}
              </li>
              <li>
                {isArabic
                  ? 'أكمل 5 أيام للحصول على مكافأة شرارة الأسبوع'
                  : 'Complete 5 days to earn your Weekly Spark bonus'}
              </li>
              <li>
                {isArabic
                  ? 'يتم إعادة تعيين العداد كل يوم اثنين'
                  : 'Counter resets every Monday'}
              </li>
            </ul>
          </AccordionItem>
        </div>

        {/* Contact Support */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-text-secondary text-sm mb-2">
              {isArabic ? 'هل لديك أسئلة أخرى؟' : 'Have more questions?'}
            </p>
            <p className="text-brand-primary font-medium">
              {isArabic ? 'تواصل معنا عبر support@fawz.iq' : 'Contact us at support@fawz.iq'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
