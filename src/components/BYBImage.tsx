import Image, { ImageProps } from 'next/image'

export interface BYBImageProps extends Omit<ImageProps, 'sizes'> {
  sizes?: string
}

export function BYBImage({
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  alt,
  ...props
}: BYBImageProps) {
  return (
    <Image
      sizes={sizes}
      alt={alt}
      {...props}
    />
  )
}
