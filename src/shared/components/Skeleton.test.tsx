/**
 * Skeleton Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonButton,
} from './Skeleton';

describe('Skeleton', () => {
  describe('basic rendering', () => {
    it('should render with skeleton class', () => {
      const { container } = render(<Skeleton />);
      expect(container.querySelector('.skeleton')).toBeInTheDocument();
    });

    it('should render with default rounded-md', () => {
      const { container } = render(<Skeleton />);
      expect(container.querySelector('.rounded-md')).toBeInTheDocument();
    });
  });

  describe('dimensions', () => {
    it('should apply width as number', () => {
      const { container } = render(<Skeleton width={100} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.width).toBe('100px');
    });

    it('should apply width as string', () => {
      const { container } = render(<Skeleton width="50%" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.width).toBe('50%');
    });

    it('should apply height as number', () => {
      const { container } = render(<Skeleton height={50} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.height).toBe('50px');
    });

    it('should apply height as string', () => {
      const { container } = render(<Skeleton height="2rem" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.height).toBe('2rem');
    });
  });

  describe('rounded variants', () => {
    it('should render with rounded-none', () => {
      const { container } = render(<Skeleton rounded="none" />);
      expect(container.querySelector('.rounded-none')).toBeInTheDocument();
    });

    it('should render with rounded-sm', () => {
      const { container } = render(<Skeleton rounded="sm" />);
      expect(container.querySelector('.rounded-sm')).toBeInTheDocument();
    });

    it('should render with rounded-md', () => {
      const { container } = render(<Skeleton rounded="md" />);
      expect(container.querySelector('.rounded-md')).toBeInTheDocument();
    });

    it('should render with rounded-lg', () => {
      const { container } = render(<Skeleton rounded="lg" />);
      expect(container.querySelector('.rounded-lg')).toBeInTheDocument();
    });

    it('should render with rounded-xl', () => {
      const { container } = render(<Skeleton rounded="xl" />);
      expect(container.querySelector('.rounded-xl')).toBeInTheDocument();
    });

    it('should render with rounded-full', () => {
      const { container } = render(<Skeleton rounded="full" />);
      expect(container.querySelector('.rounded-full')).toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('should merge custom className', () => {
      const { container } = render(<Skeleton className="w-full h-8" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('w-full');
      expect(skeleton).toHaveClass('h-8');
    });
  });
});

describe('SkeletonText', () => {
  it('should render single line by default', () => {
    const { container } = render(<SkeletonText />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(1);
  });

  it('should render multiple lines', () => {
    const { container } = render(<SkeletonText lines={3} />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('should make last line shorter for multiple lines', () => {
    const { container } = render(<SkeletonText lines={3} />);
    const skeletons = container.querySelectorAll('.skeleton');
    // Last line should have w-3/4 class
    expect(skeletons[2]).toHaveClass('w-3/4');
  });

  it('should not shorten single line', () => {
    const { container } = render(<SkeletonText lines={1} />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toHaveClass('w-full');
  });

  it('should have space-y-2 for line spacing', () => {
    const { container } = render(<SkeletonText lines={3} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('space-y-2');
  });

  it('should merge custom className', () => {
    const { container } = render(<SkeletonText className="my-custom-class" />);
    expect(container.querySelector('.my-custom-class')).toBeInTheDocument();
  });
});

describe('SkeletonAvatar', () => {
  it('should render with default size 40', () => {
    const { container } = render(<SkeletonAvatar />);
    const skeleton = container.querySelector('.skeleton') as HTMLElement;
    expect(skeleton.style.width).toBe('40px');
    expect(skeleton.style.height).toBe('40px');
  });

  it('should render with custom size', () => {
    const { container } = render(<SkeletonAvatar size={64} />);
    const skeleton = container.querySelector('.skeleton') as HTMLElement;
    expect(skeleton.style.width).toBe('64px');
    expect(skeleton.style.height).toBe('64px');
  });

  it('should be circular (rounded-full)', () => {
    const { container } = render(<SkeletonAvatar />);
    expect(container.querySelector('.rounded-full')).toBeInTheDocument();
  });

  it('should merge custom className', () => {
    const { container } = render(<SkeletonAvatar className="custom-avatar" />);
    expect(container.querySelector('.custom-avatar')).toBeInTheDocument();
  });
});

describe('SkeletonCard', () => {
  it('should render avatar skeleton', () => {
    const { container } = render(<SkeletonCard />);
    // Avatar is 40x40 rounded-full
    const avatar = container.querySelector('.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('should render title and subtitle placeholders', () => {
    const { container } = render(<SkeletonCard />);
    // Should have multiple skeleton elements
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(3);
  });

  it('should render text lines', () => {
    const { container } = render(<SkeletonCard />);
    // Should have space-y-2 for text lines
    const textGroup = container.querySelector('.space-y-2');
    expect(textGroup).toBeInTheDocument();
  });

  it('should have proper padding', () => {
    const { container } = render(<SkeletonCard />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('p-4');
  });

  it('should merge custom className', () => {
    const { container } = render(<SkeletonCard className="custom-card" />);
    expect(container.querySelector('.custom-card')).toBeInTheDocument();
  });
});

describe('SkeletonButton', () => {
  it('should render with medium height by default', () => {
    const { container } = render(<SkeletonButton />);
    const skeleton = container.querySelector('.skeleton') as HTMLElement;
    expect(skeleton.style.height).toBe('44px');
  });

  it('should render with small height', () => {
    const { container } = render(<SkeletonButton size="sm" />);
    const skeleton = container.querySelector('.skeleton') as HTMLElement;
    expect(skeleton.style.height).toBe('36px');
  });

  it('should render with large height', () => {
    const { container } = render(<SkeletonButton size="lg" />);
    const skeleton = container.querySelector('.skeleton') as HTMLElement;
    expect(skeleton.style.height).toBe('52px');
  });

  it('should be full width', () => {
    const { container } = render(<SkeletonButton />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toHaveClass('w-full');
  });

  it('should have rounded-lg', () => {
    const { container } = render(<SkeletonButton />);
    expect(container.querySelector('.rounded-lg')).toBeInTheDocument();
  });

  it('should merge custom className', () => {
    const { container } = render(<SkeletonButton className="custom-button" />);
    expect(container.querySelector('.custom-button')).toBeInTheDocument();
  });
});
