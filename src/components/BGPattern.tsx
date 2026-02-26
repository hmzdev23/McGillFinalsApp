/**
 * BGPattern — lightweight background pattern component
 * Adapted from shadcn bg-pattern for plain React/JSX
 */

import React from 'react';

type VariantKey = 'dots' | 'grid' | 'diagonal-stripes' | 'horizontal-lines' | 'vertical-lines' | 'checkerboard';
type MaskStyleKey = 'fade-edges' | 'fade-center' | 'fade-top' | 'fade-bottom' | 'fade-left' | 'fade-right' | 'fade-x' | 'fade-y' | 'none';

function getBgImage(variant: VariantKey, fill: string, size: number): string | undefined {
    switch (variant) {
        case 'dots':
            return `radial-gradient(${fill} 1px, transparent 1px)`
        case 'grid':
            return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`
        case 'diagonal-stripes':
            return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`
        case 'horizontal-lines':
            return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`
        case 'vertical-lines':
            return `linear-gradient(to right, ${fill} 1px, transparent 1px)`
        case 'checkerboard':
            return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`
        default:
            return undefined
    }
}

const maskStyles: Record<MaskStyleKey, string | undefined> = {
    'fade-edges': 'radial-gradient(ellipse at center, black, transparent)',
    'fade-center': 'radial-gradient(ellipse at center, transparent, black)',
    'fade-top': 'linear-gradient(to bottom, transparent, black)',
    'fade-bottom': 'linear-gradient(to bottom, black, transparent)',
    'fade-left': 'linear-gradient(to right, transparent, black)',
    'fade-right': 'linear-gradient(to right, black, transparent)',
    'fade-x': 'linear-gradient(to right, transparent, black, transparent)',
    'fade-y': 'linear-gradient(to bottom, transparent, black, transparent)',
    'none': undefined,
}

export default function BGPattern({
    variant = 'dots',
    mask = 'none',
    size = 24,
    fill = '#e5e7eb',
    className = '',
    style = {},
    ...props
}: {
    variant?: VariantKey;
    mask?: MaskStyleKey;
    size?: number;
    fill?: string;
    className?: string;
    style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>) {
    const bgSize = `${size}px ${size}px`
    const backgroundImage = getBgImage(variant, fill, size)
    const maskImage = maskStyles[mask]

    return (
        <div
            className={`absolute inset-0 z-0 w-full h-full ${className}`}
            style={{
                backgroundImage,
                backgroundSize: bgSize,
                ...(maskImage ? { maskImage, WebkitMaskImage: maskImage } : {}),
                ...style,
            }}
            {...props}
        />
    )
}
