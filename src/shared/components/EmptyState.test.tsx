/**
 * EmptyState Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  describe('rendering', () => {
    it('should render title', () => {
      render(<EmptyState title="لا توجد بيانات" />);
      expect(screen.getByText('لا توجد بيانات')).toBeInTheDocument();
    });

    it('should render default icon when not provided', () => {
      const { container } = render(<EmptyState title="Empty" />);
      // Default is Inbox icon
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render custom icon when provided', () => {
      render(
        <EmptyState
          title="Empty"
          icon={<span data-testid="custom-icon">📭</span>}
        />,
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('description', () => {
    it('should render description when provided', () => {
      render(
        <EmptyState
          title="Empty"
          description="لا يوجد أي محتوى لعرضه حالياً"
        />,
      );
      expect(screen.getByText('لا يوجد أي محتوى لعرضه حالياً')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const { container } = render(<EmptyState title="Empty" />);
      // Should have h3 for title but no p for description
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBe(0);
    });
  });

  describe('action button', () => {
    it('should render action button when both label and handler provided', () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          title="Empty"
          actionLabel="إضافة عنصر"
          onAction={handleAction}
        />,
      );
      expect(screen.getByText('إضافة عنصر')).toBeInTheDocument();
    });

    it('should call onAction when button is clicked', () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          title="Empty"
          actionLabel="Add"
          onAction={handleAction}
        />,
      );

      fireEvent.click(screen.getByText('Add'));

      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it('should not render button when only label provided', () => {
      render(
        <EmptyState
          title="Empty"
          actionLabel="Add"
        />,
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should not render button when only handler provided', () => {
      render(
        <EmptyState
          title="Empty"
          onAction={() => {}}
        />,
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have centered flex layout', () => {
      const { container } = render(<EmptyState title="Empty" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('flex-col');
      expect(wrapper).toHaveClass('items-center');
      expect(wrapper).toHaveClass('justify-center');
    });

    it('should have text-center', () => {
      const { container } = render(<EmptyState title="Empty" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('text-center');
    });

    it('should have proper padding', () => {
      const { container } = render(<EmptyState title="Empty" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('py-12');
      expect(wrapper).toHaveClass('px-4');
    });

    it('should merge custom className', () => {
      const { container } = render(
        <EmptyState title="Empty" className="custom-empty" />,
      );
      expect(container.querySelector('.custom-empty')).toBeInTheDocument();
    });
  });

  describe('icon styling', () => {
    it('should have icon wrapper with muted background', () => {
      const { container } = render(<EmptyState title="Empty" />);
      const iconWrapper = container.querySelector('.bg-bg-muted');
      expect(iconWrapper).toBeInTheDocument();
    });

    it('should have rounded-full icon wrapper', () => {
      const { container } = render(<EmptyState title="Empty" />);
      const iconWrapper = container.querySelector('.rounded-full');
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe('title styling', () => {
    it('should have proper text styles for title', () => {
      render(<EmptyState title="Empty Title" />);
      const title = screen.getByText('Empty Title');
      expect(title).toHaveClass('text-lg');
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('text-text-primary');
    });
  });

  describe('description styling', () => {
    it('should have proper text styles for description', () => {
      render(<EmptyState title="Empty" description="Description text" />);
      const description = screen.getByText('Description text');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('text-text-secondary');
    });

    it('should have max-width constraint', () => {
      render(<EmptyState title="Empty" description="Description" />);
      const description = screen.getByText('Description');
      expect(description).toHaveClass('max-w-sm');
    });
  });

  describe('button variant', () => {
    it('should render primary button variant', () => {
      render(
        <EmptyState
          title="Empty"
          actionLabel="Action"
          onAction={() => {}}
        />,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-brand-primary');
    });
  });

  describe('RTL support', () => {
    it('should center content properly for RTL', () => {
      const { container } = render(<EmptyState title="عنوان فارغ" />);
      const wrapper = container.firstChild as HTMLElement;
      // Uses items-center which works for both RTL and LTR
      expect(wrapper).toHaveClass('items-center');
    });
  });
});
