/**
 * ErrorState Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  describe('rendering', () => {
    it('should render with default title', () => {
      render(<ErrorState />);
      expect(screen.getByText('حدث خطأ')).toBeInTheDocument();
    });

    it('should render with default message', () => {
      render(<ErrorState />);
      expect(
        screen.getByText('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى'),
      ).toBeInTheDocument();
    });

    it('should render custom title', () => {
      render(<ErrorState title="خطأ في الاتصال" />);
      expect(screen.getByText('خطأ في الاتصال')).toBeInTheDocument();
    });

    it('should render custom message', () => {
      render(<ErrorState message="تعذر الاتصال بالخادم" />);
      expect(screen.getByText('تعذر الاتصال بالخادم')).toBeInTheDocument();
    });

    it('should render error icon', () => {
      const { container } = render(<ErrorState />);
      // AlertCircle icon should be rendered
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('retry button', () => {
    it('should render retry button when onRetry is provided', () => {
      render(<ErrorState onRetry={() => {}} />);
      expect(screen.getByText('إعادة المحاولة')).toBeInTheDocument();
    });

    it('should not render retry button when onRetry is not provided', () => {
      render(<ErrorState />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should call onRetry when clicked', () => {
      const handleRetry = vi.fn();
      render(<ErrorState onRetry={handleRetry} />);

      fireEvent.click(screen.getByText('إعادة المحاولة'));

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('should render custom retry label', () => {
      render(<ErrorState onRetry={() => {}} retryLabel="حاول مجدداً" />);
      expect(screen.getByText('حاول مجدداً')).toBeInTheDocument();
    });

    it('should have refresh icon in retry button', () => {
      render(<ErrorState onRetry={() => {}} />);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have centered flex layout', () => {
      const { container } = render(<ErrorState />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('flex-col');
      expect(wrapper).toHaveClass('items-center');
      expect(wrapper).toHaveClass('justify-center');
    });

    it('should have text-center', () => {
      const { container } = render(<ErrorState />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('text-center');
    });

    it('should have proper padding', () => {
      const { container } = render(<ErrorState />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('py-12');
      expect(wrapper).toHaveClass('px-4');
    });

    it('should merge custom className', () => {
      const { container } = render(<ErrorState className="custom-error" />);
      expect(container.querySelector('.custom-error')).toBeInTheDocument();
    });
  });

  describe('icon styling', () => {
    it('should have error-light background for icon wrapper', () => {
      const { container } = render(<ErrorState />);
      const iconWrapper = container.querySelector('.bg-error-light');
      expect(iconWrapper).toBeInTheDocument();
    });

    it('should have error text color for icon', () => {
      const { container } = render(<ErrorState />);
      const iconWrapper = container.querySelector('.text-error');
      expect(iconWrapper).toBeInTheDocument();
    });

    it('should have rounded-full icon wrapper', () => {
      const { container } = render(<ErrorState />);
      const iconWrapper = container.querySelector('.rounded-full');
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe('title styling', () => {
    it('should have proper text styles for title', () => {
      render(<ErrorState title="Error Title" />);
      const title = screen.getByText('Error Title');
      expect(title).toHaveClass('text-lg');
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('text-text-primary');
    });
  });

  describe('message styling', () => {
    it('should have proper text styles for message', () => {
      render(<ErrorState message="Error message" />);
      const message = screen.getByText('Error message');
      expect(message).toHaveClass('text-sm');
      expect(message).toHaveClass('text-text-secondary');
    });

    it('should have max-width constraint', () => {
      render(<ErrorState message="Error" />);
      const message = screen.getByText('Error');
      expect(message).toHaveClass('max-w-sm');
    });
  });

  describe('button variant', () => {
    it('should render outline button variant', () => {
      render(<ErrorState onRetry={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-brand-primary');
    });
  });

  describe('RTL support', () => {
    it('should center content properly for RTL', () => {
      const { container } = render(<ErrorState title="خطأ" message="رسالة الخطأ" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('items-center');
    });
  });

  describe('common error scenarios', () => {
    it('should work for network error', () => {
      render(
        <ErrorState
          title="خطأ في الشبكة"
          message="تأكد من اتصالك بالإنترنت"
          onRetry={() => {}}
        />,
      );
      expect(screen.getByText('خطأ في الشبكة')).toBeInTheDocument();
      expect(screen.getByText('تأكد من اتصالك بالإنترنت')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should work for server error', () => {
      render(
        <ErrorState
          title="خطأ في الخادم"
          message="حدث خطأ في الخادم، يرجى المحاولة لاحقاً"
          onRetry={() => {}}
        />,
      );
      expect(screen.getByText('خطأ في الخادم')).toBeInTheDocument();
    });

    it('should work for unauthorized error without retry', () => {
      render(
        <ErrorState
          title="غير مصرح"
          message="يرجى تسجيل الدخول مرة أخرى"
        />,
      );
      expect(screen.getByText('غير مصرح')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
