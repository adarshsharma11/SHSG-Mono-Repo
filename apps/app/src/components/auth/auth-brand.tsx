import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@shsg/ui/logo';

export function AuthBrand() {
  return <Logo as={Link} src="/images/brand/logo.webp" imageAs={Image} imageWidth={486} imageHeight={374} url="/" variant="light" aria-label="Southern Home Services Group app home" />;
}
