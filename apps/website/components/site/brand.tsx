import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@shsg/ui/logo';

export function Brand({ light = false, url = '/' }: { light?: boolean; url?: string }) {
  return <Logo as={Link} src="/images/brand/logo.webp" imageAs={Image} imageWidth={486} imageHeight={374} url={url} variant={light ? 'light' : 'default'} className={`site-brand ${light ? 'site-brand-light' : ''}`} />;
}
