/**
 * Consent Feature
 * Public API exports
 */

// Types
export * from './types/consent.types';

// Services & Hooks
export {
  consentKeys,
  CONSENT_VERSIONS,
  useConsents,
  useConsent,
  useConsentByType,
  useConsentStatus,
  useShariaDisclosureAccepted,
  useAcceptShariaDisclosure,
  useSubmitMediaConsent,
  useUpsertConsent,
} from './services/consent.service';

// Components
export { ShariaDisclosureModal } from './components/ShariaDisclosureModal';
export { MediaConsentModal } from './components/MediaConsentModal';
