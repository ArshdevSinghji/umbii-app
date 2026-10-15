import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type {
  IconProps as PhosphorIconProps,
  Icon as PhosphorIcon,
} from 'phosphor-react-native';
import { cssInterop } from 'nativewind';
import * as React from 'react';

type IconProps = PhosphorIconProps & {
  as: PhosphorIcon;
  className?: string;
  'aria-hidden'?: boolean;
};

function IconImpl({
  as: IconComponent,
  'aria-hidden': _ariaHidden,
  ...props
}: IconProps) {
  return <IconComponent {...props} />;
}

// `text-*` classes become the icon's `color`, `size-*` its `size`.
cssInterop(IconImpl, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
      height: 'size',
      width: 'size',
    },
  },
});

/**
 * A wrapper for Phosphor icons with Nativewind `className` support via `cssInterop`.
 *
 * Renders any Phosphor icon while applying utility classes (`text-*` for the
 * colour, `size-*` for the size), without wrapping each icon individually.
 *
 * @example
 * ```tsx
 * import { ArrowRight } from 'phosphor-react-native/src/icons/ArrowRight';
 * import { Icon } from '@/components/ui/icon';
 *
 * <Icon as={ArrowRight} className='text-red-500' size={16} />
 * ```
 *
 * @param {PhosphorIcon} as - The Phosphor icon component to render.
 * @param {string} className - Utility classes to style the icon using Nativewind.
 * @param {number} size - Icon size (defaults to 14).
 * @param {...PhosphorIconProps} ...props - Other Phosphor props (e.g. `weight`).
 */
function Icon({
  as: IconComponent,
  className,
  size = 14,
  ...props
}: IconProps) {
  const textClass = React.useContext(TextClassContext);
  return (
    <IconImpl
      as={IconComponent}
      className={cn('text-foreground', textClass, className)}
      size={size}
      {...props}
    />
  );
}

export { Icon };
