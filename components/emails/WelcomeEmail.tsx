import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Hr,
} from '@react-email/components';

interface WelcomeEmailProps {
    userFirstname: string;
}

const baseUrl = 'https://footfits.pk';

export const WelcomeEmail = ({ userFirstname }: WelcomeEmailProps) => (
    <Html>
        <Head>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            `}</style>
        </Head>
        <Preview>Welcome to FootFits, {userFirstname} — your sole journey starts now. 👟</Preview>

        <Body style={main}>

            {/* ── TOP HEADER BAR ── */}
            <Section style={topBar}>
                <Text style={topBarText}>FREE DELIVERY ON ORDERS OVER RS. 3,000</Text>
            </Section>

            {/* ── LOGO AREA ── */}
            <Section style={logoSection}>
                <Img
                    src={`${baseUrl}/logo-email.png`}
                    alt="FootFits"
                    width="220"
                    height="50"
                    style={logoStyle}
                />
            </Section>

            {/* ── HERO BANNER ── */}
            <Section style={heroBanner}>
                <Text style={heroEyebrow}>WELCOME TO THE FAMILY</Text>
                <Text style={heroHeading}>
                    Hey {userFirstname}, <br />
                    Your Sole Journey <br />
                    Starts Here. 👟
                </Text>
                <Text style={heroSubtext}>
                    You're now part of Pakistan's most trusted pre-owned sneaker community. Real kicks. Real brands. Real prices.
                </Text>
                <Link href={`${baseUrl}/shop`} style={heroCTA}>
                    Explore the Collection →
                </Link>
            </Section>

            {/* ── DIVIDER WITH ACCENT ── */}
            <Section style={accentDividerSection}>
                <Text style={accentDivider}>✦ &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; ✦</Text>
            </Section>

            {/* ── PERKS SECTION ── */}
            <Container style={perksContainer}>
                <Text style={perksTitle}>What's in it for you</Text>

                <Row style={perkRow}>
                    <Column style={perkIconCol}>
                        <Text style={perkEmoji}>📦</Text>
                    </Column>
                    <Column style={perkTextCol}>
                        <Text style={perkHeading}>Real-time Order Tracking</Text>
                        <Text style={perkDesc}>Watch your order go from packed to your doorstep, every step of the way.</Text>
                    </Column>
                </Row>

                <Hr style={perkDivider} />

                <Row style={perkRow}>
                    <Column style={perkIconCol}>
                        <Text style={perkEmoji}>⚡</Text>
                    </Column>
                    <Column style={perkTextCol}>
                        <Text style={perkHeading}>Faster Checkout</Text>
                        <Text style={perkDesc}>Your details are saved — checkout in seconds on your next purchase.</Text>
                    </Column>
                </Row>

                <Hr style={perkDivider} />

                <Row style={perkRow}>
                    <Column style={perkIconCol}>
                        <Text style={perkEmoji}>🔒</Text>
                    </Column>
                    <Column style={perkTextCol}>
                        <Text style={perkHeading}>Authenticity Guaranteed</Text>
                        <Text style={perkDesc}>Every pair is inspected and graded. No fakes. Ever.</Text>
                    </Column>
                </Row>

                <Hr style={perkDivider} />

                <Row style={perkRow}>
                    <Column style={perkIconCol}>
                        <Text style={perkEmoji}>⭐</Text>
                    </Column>
                    <Column style={perkTextCol}>
                        <Text style={perkHeading}>Leave Your Review</Text>
                        <Text style={perkDesc}>Bought a pair? Tell the community about your experience.</Text>
                    </Column>
                </Row>
            </Container>

            {/* ── BRANDS STRIP ── */}
            <Section style={brandStrip}>
                <Text style={brandStripLabel}>WE CARRY</Text>
                <Text style={brandNames}>Nike &nbsp;·&nbsp; Adidas &nbsp;·&nbsp; New Balance &nbsp;·&nbsp; Puma &nbsp;·&nbsp; Skechers &nbsp;·&nbsp; Under Armour</Text>
            </Section>

            {/* ── MAIN CTA ── */}
            <Section style={ctaSection}>
                <Text style={ctaHeading}>Ready to find your next pair?</Text>
                <Link href={`${baseUrl}/shop`} style={mainCTAButton}>
                    Shop Now
                </Link>
                <Text style={ctaNote}>
                    Got a question? WhatsApp us at{' '}
                    <Link href="https://wa.me/923132319987" style={linkStyle}>
                        +92 313 2319987
                    </Link>
                </Text>
            </Section>

            {/* ── FOOTER ── */}
            <Section style={footerSection}>
                <Img
                    src={`${baseUrl}/logo-email.png`}
                    alt="FootFits"
                    width="100"
                    height="22"
                    style={{ margin: '0 auto 16px', display: 'block', opacity: 0.5 }}
                />
                <Text style={footerLinks}>
                    <Link href={`${baseUrl}/shop`} style={footerLink}>Shop</Link>
                    &nbsp;&nbsp;·&nbsp;&nbsp;
                    <Link href={`${baseUrl}/about`} style={footerLink}>About</Link>
                    &nbsp;&nbsp;·&nbsp;&nbsp;
                    <Link href={`${baseUrl}/contact`} style={footerLink}>Contact</Link>
                </Text>
                <Text style={footerText}>
                    © {new Date().getFullYear()} FootFits. All rights reserved. <br />
                    Pakistan's home of authentic pre-owned sneakers.
                </Text>
                <Text style={footerUnsubscribe}>
                    You received this because you created an account.{' '}
                    <Link href={`${baseUrl}/account`} style={footerLink}>Manage preferences</Link>
                </Text>
            </Section>

        </Body>
    </Html>
);

// ─── Styles ──────────────────────────────────────────────────────────────────

const BRAND_GREEN = '#305752';
const BRAND_GOLD = '#DCAA2D';
const BRAND_DARK = '#1a1a1a';

const main = {
    backgroundColor: '#F5F3EF',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    margin: '0 auto',
};

// Top bar
const topBar = {
    backgroundColor: BRAND_GREEN,
    padding: '10px 24px',
    textAlign: 'center' as const,
};

const topBarText = {
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '600' as const,
    letterSpacing: '1.5px',
    margin: '0',
};

// Logo
const logoSection = {
    backgroundColor: '#ffffff',
    padding: '28px 40px',
    textAlign: 'center' as const,
    borderBottom: `3px solid ${BRAND_GOLD}`,
};

const logoStyle = {
    margin: '0 auto',
    display: 'block' as const,
};

// Hero
const heroBanner = {
    backgroundColor: BRAND_GREEN,
    padding: '56px 48px 48px',
    textAlign: 'center' as const,
};

const heroEyebrow = {
    color: BRAND_GOLD,
    fontSize: '11px',
    fontWeight: '700' as const,
    letterSpacing: '3px',
    margin: '0 0 16px',
    textTransform: 'uppercase' as const,
};

const heroHeading = {
    color: '#ffffff',
    fontSize: '36px',
    fontWeight: '700' as const,
    lineHeight: '1.25',
    margin: '0 0 20px',
};

const heroSubtext = {
    color: 'rgba(255,255,255,0.78)',
    fontSize: '16px',
    lineHeight: '1.7',
    margin: '0 auto 32px',
    maxWidth: '380px',
};

const heroCTA = {
    backgroundColor: BRAND_GOLD,
    borderRadius: '6px',
    color: '#1a1a1a',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '700' as const,
    letterSpacing: '0.5px',
    padding: '14px 36px',
    textDecoration: 'none',
};

// Accent divider
const accentDividerSection = {
    backgroundColor: '#F5F3EF',
    padding: '28px 0 8px',
    textAlign: 'center' as const,
};

const accentDivider = {
    color: BRAND_GOLD,
    fontSize: '14px',
    margin: '0',
    letterSpacing: '4px',
};

// Perks
const perksContainer = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    margin: '8px 24px 24px',
    padding: '32px 36px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const perksTitle = {
    color: BRAND_DARK,
    fontSize: '13px',
    fontWeight: '700' as const,
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    margin: '0 0 24px',
};

const perkRow = {
    marginBottom: '0',
};

const perkIconCol = {
    width: '52px',
    verticalAlign: 'top' as const,
    paddingTop: '2px',
};

const perkEmoji = {
    fontSize: '24px',
    margin: '0',
    lineHeight: '1',
};

const perkTextCol = {
    verticalAlign: 'top' as const,
};

const perkHeading = {
    color: BRAND_DARK,
    fontSize: '15px',
    fontWeight: '600' as const,
    margin: '0 0 4px',
    lineHeight: '1.3',
};

const perkDesc = {
    color: '#6b7280',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0',
};

const perkDivider = {
    borderColor: '#f0f0f0',
    borderTopWidth: '1px',
    margin: '16px 0',
};

// Brands strip
const brandStrip = {
    backgroundColor: BRAND_DARK,
    padding: '20px 24px',
    textAlign: 'center' as const,
    margin: '0 0 0 0',
};

const brandStripLabel = {
    color: BRAND_GOLD,
    fontSize: '10px',
    fontWeight: '700' as const,
    letterSpacing: '2.5px',
    margin: '0 0 6px',
};

const brandNames = {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    fontWeight: '500' as const,
    letterSpacing: '0.5px',
    margin: '0',
};

// CTA section
const ctaSection = {
    backgroundColor: '#F5F3EF',
    padding: '48px 32px',
    textAlign: 'center' as const,
};

const ctaHeading = {
    color: BRAND_DARK,
    fontSize: '22px',
    fontWeight: '700' as const,
    margin: '0 0 24px',
};

const mainCTAButton = {
    backgroundColor: BRAND_GREEN,
    borderRadius: '6px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: '700' as const,
    letterSpacing: '0.5px',
    padding: '15px 48px',
    textDecoration: 'none',
};

const ctaNote = {
    color: '#6b7280',
    fontSize: '13px',
    marginTop: '20px',
};

const linkStyle = {
    color: BRAND_GREEN,
    fontWeight: '600' as const,
    textDecoration: 'underline',
};

// Footer
const footerSection = {
    backgroundColor: '#1a1a1a',
    padding: '36px 24px 28px',
    textAlign: 'center' as const,
};

const footerLinks = {
    margin: '0 0 16px',
};

const footerLink = {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '12px',
    textDecoration: 'none',
};

const footerText = {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '11px',
    lineHeight: '1.8',
    margin: '0 0 12px',
};

const footerUnsubscribe = {
    color: 'rgba(255,255,255,0.25)',
    fontSize: '10px',
    margin: '0',
};

export default WelcomeEmail;
