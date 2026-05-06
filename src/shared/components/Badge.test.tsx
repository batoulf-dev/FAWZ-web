/**
 * Badge Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('should render children text', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render as span element', () => {
      render(<Badge>Test</Badge>);
      expect(screen.getByText('Test').tagName).toBe('SPAN');
    });
  });

  describe('variants', () => {
    it('should render default variant', () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('bg-bg-muted');
      expect(badge).toHaveClass('text-text-secondary');
    });

    it('should render primary variant', () => {
      render(<Badge variant="primary">Primary</Badge>);
      const badge = screen.getByText('Primary');
      expect(badge).toHaveClass('bg-brand-primary/10');
      expect(badge).toHaveClass('text-brand-primary');
    });

    it('should render secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      const badge = screen.getByText('Secondary');
      expect(badge).toHaveClass('bg-brand-secondary/10');
      expect(badge).toHaveClass('text-brand-secondary-dark');
    });

    it('should render success variant', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass('bg-success-light');
      expect(badge).toHaveClass('text-success');
    });

    it('should render warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText('Warning');
      expect(badge).toHaveClass('bg-warning-light');
      expect(badge).toHaveClass('text-warning');
    });

    it('should render error variant', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge).toHaveClass('bg-error-light');
      expect(badge).toHaveClass('text-error');
    });

    it('should render info variant', () => {
      render(<Badge variant="info">Info</Badge>);
      const badge = screen.getByText('Info');
      expect(badge).toHaveClass('bg-info-light');
      expect(badge).toHaveClass('text-info');
    });

    it('should default to default variant', () => {
      render(<Badge>No Variant</Badge>);
      const badge = screen.getByText('No Variant');
      expect(badge).toHaveClass('bg-bg-muted');
    });
  });

  describe('sizes', () => {
    it('should render small size by default', () => {
      render(<Badge>Small</Badge>);
      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('text-xs');
    });

    it('should render small size', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('text-xs');
    });

    it('should render medium size', () => {
      render(<Badge size="md">Medium</Badge>);
      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('text-sm');
    });
  });

  describe('styling', () => {
    it('should have inline-flex display', () => {
      render(<Badge>Flex</Badge>);
      const badge = screen.getByText('Flex');
      expect(badge).toHaveClass('inline-flex');
    });

    it('should have centered content', () => {
      render(<Badge>Centered</Badge>);
      const badge = screen.getByText('Centered');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('justify-center');
    });

    it('should have rounded-full', () => {
      render(<Badge>Rounded</Badge>);
      const badge = screen.getByText('Rounded');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should have font-medium', () => {
      render(<Badge>Medium Font</Badge>);
      const badge = screen.getByText('Medium Font');
      expect(badge).toHaveClass('font-medium');
    });
  });

  describe('custom className', () => {
    it('should merge custom className', () => {
      render(<Badge className="custom-badge">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-badge');
    });

    it('should allow overriding styles', () => {
      render(<Badge className="text-lg">Override</Badge>);
      const badge = screen.getByText('Override');
      // Both classes should be present (tailwind-merge handles conflicts)
      expect(badge).toHaveClass('text-lg');
    });
  });

  describe('use cases', () => {
    it('should work as status indicator', () => {
      render(<Badge variant="success">نشط</Badge>);
      expect(screen.getByText('نشط')).toBeInTheDocument();
    });

    it('should work as count badge', () => {
      render(<Badge variant="error">5</Badge>);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should work with Arabic text', () => {
      render(<Badge variant="info">قيد الانتظار</Badge>);
      expect(screen.getByText('قيد الانتظار')).toBeInTheDocument();
    });

    it('should work for payout status', () => {
      render(<Badge variant="success">مكتمل</Badge>);
      const badge = screen.getByText('مكتمل');
      expect(badge).toHaveClass('text-success');
    });

    it('should work for entry outcome', () => {
      render(<Badge variant="warning">بانتظار السحب</Badge>);
      const badge = screen.getByText('بانتظار السحب');
      expect(badge).toHaveClass('text-warning');
    });
  });

  describe('accessibility', () => {
    it('should be visible to screen readers', () => {
      render(<Badge>Status</Badge>);
      // Badge content should be accessible
      expect(screen.getByText('Status')).toBeVisible();
    });
  });
});
