/**
 * Input Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  describe('rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });
  });

  describe('label', () => {
    it('should render label when provided', () => {
      render(<Input label="Username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should associate label with input', () => {
      render(<Input label="Email" id="email-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('should generate unique id if not provided', () => {
      render(<Input label="Test" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id');
    });
  });

  describe('helper text', () => {
    it('should render helper text when provided', () => {
      render(<Input helperText="This is helper text" />);
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('should have secondary text color', () => {
      render(<Input helperText="Helper" />);
      const helper = screen.getByText('Helper');
      expect(helper).toHaveClass('text-text-secondary');
    });
  });

  describe('error state', () => {
    it('should render error message when provided', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should have error styles on input', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error');
    });

    it('should have error color on label', () => {
      render(<Input label="Name" error="Required" />);
      const label = screen.getByText('Name');
      expect(label).toHaveClass('text-error');
    });

    it('should prefer error over helperText', () => {
      render(<Input helperText="Helper" error="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('should render left icon', () => {
      render(
        <Input leftIcon={<span data-testid="left-icon">🔍</span>} />,
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      render(
        <Input rightIcon={<span data-testid="right-icon">✓</span>} />,
      );
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should add padding for left icon', () => {
      render(
        <Input leftIcon={<span>🔍</span>} />,
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('ps-10');
    });

    it('should add padding for right icon', () => {
      render(
        <Input rightIcon={<span>✓</span>} />,
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pe-10');
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should have disabled styles', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:opacity-50');
    });
  });

  describe('input types', () => {
    it('should default to text type', () => {
      render(<Input />);
      // HTML inputs default to text type even without explicit attribute
      const input = screen.getByRole('textbox');
      expect(input).toBeInstanceOf(HTMLInputElement);
      expect((input as HTMLInputElement).type).toBe('text');
    });

    it('should accept email type', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should accept password type', () => {
      render(<Input type="password" />);
      // Password inputs don't have textbox role
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should accept tel type', () => {
      render(<Input type="tel" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
    });
  });

  describe('value handling', () => {
    it('should display controlled value', () => {
      render(<Input value="controlled value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('controlled value');
    });

    it('should call onChange when value changes', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'new value' },
      });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle uncontrolled input', () => {
      render(<Input defaultValue="default" />);
      expect(screen.getByRole('textbox')).toHaveValue('default');
    });
  });

  describe('RTL layout', () => {
    it('should use logical properties for padding', () => {
      render(
        <Input
          leftIcon={<span>←</span>}
          rightIcon={<span>→</span>}
        />,
      );
      const input = screen.getByRole('textbox');
      // Should use ps/pe instead of pl/pr
      expect(input).toHaveClass('ps-10');
      expect(input).toHaveClass('pe-10');
    });

    it('should position icons with start/end', () => {
      const { container } = render(
        <Input
          leftIcon={<span>←</span>}
          rightIcon={<span>→</span>}
        />,
      );
      const leftIconWrapper = container.querySelector('.start-3');
      const rightIconWrapper = container.querySelector('.end-3');
      expect(leftIconWrapper).toBeInTheDocument();
      expect(rightIconWrapper).toBeInTheDocument();
    });
  });

  describe('focus styles', () => {
    it('should have focus ring styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:ring-2');
    });

    it('should have error focus ring when has error', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:ring-error/20');
    });

    it('should have brand focus ring when no error', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:ring-brand-primary/20');
    });
  });

  describe('accessibility', () => {
    it('should pass through aria attributes', () => {
      render(<Input aria-describedby="help-text" />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'help-text',
      );
    });

    it('should have required attribute when required', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('custom className', () => {
    it('should merge custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
