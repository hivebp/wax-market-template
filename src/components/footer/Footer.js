import cn from 'classnames'
import React from 'react'
import config from '../../config.json'
import Link from '../common/util/input/Link'
import { DiscordIcon, InstagramIcon, TelegramIcon, TwitterIcon } from '../icons'

const internalLinks = [
    {
        label: 'Explorer',
        href: '/explorer',
    },
    {
        label: 'Market',
        href: '/market',
    },
    {
        label: 'Collections',
        href: '/explorer?tab=collections',
    },
    {
        label: 'Assets',
        href: '/explorer?tab=assets',
    },
]

const companyLinks = [
    {
        label: 'FAQ',
        href: '/faq',
    },
    {
        label: 'Terms of Use',
        href: '/tou',
    },
    {
        label: 'Privacy',
        href: '/privacy',
    },
]

const socialLinks = [
    config.instagram_link && {
        href: config.instagram_link,
        Icon: InstagramIcon,
        label: 'Instagram',
    },
    config.twitter_link && {
        href: config.twitter_link,
        Icon: TwitterIcon,
        label: 'Twitter',
    },
    config.telegram_link && {
        href: config.telegram_link,
        Icon: TelegramIcon,
        label: 'Telegram',
    },
    config.discord_link && {
        href: config.discord_link,
        Icon: DiscordIcon,
        label: 'Discord',
    },
].filter(Boolean)

const SocialList = ({ links = socialLinks }) => {
    return (
        <>
            {links.map(({ href, Icon, label }, idx) => (
                <div key={idx}>
                    <a
                        href={href}
                        className={cn('text-neutral hover:text-primary transition-colors flex flex-row gap-4')}
                    >
                        <Icon />
                        <span>{label}</span>
                    </a>
                </div>
            ))}
        </>
    )
}

const LinksList = ({ links = internalLinks }) => {
    return links.map((link, idx) => (
        <div className={cn('mb-3')} key={idx}>
            <Link href={link.href}>{link.label}</Link>
        </div>
    ))
}
const Footer = () => {
    return (
        <div className={cn('w-full bg-paper py-5 mt-8')}>
            <div
                className={cn(
                    'container mx-auto',
                    'text-neutral font-bold text-base mb-4',
                    'grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12',
                )}
            >
                <div>
                    <h4 className={cn('text-primary text-xl mt-2')}>Connect with Us</h4>
                    <div className={cn('flex flex-col mt-5 gap-4', 'text-neutral')}>
                        <SocialList />
                    </div>
                </div>
                <div>
                    <h4 className={cn('text-primary text-xl mt-2')}>WAX Market</h4>
                    <div className={cn('flex flex-col mt-5 gap-4', 'text-neutral')}>
                        <LinksList links={internalLinks} />
                    </div>
                </div>
                <div>
                    <h4 className={cn('text-primary text-xl mt-2')}>Company Links</h4>
                    <div className={cn('flex flex-col mt-5 gap-4', 'text-neutral')}>
                        <LinksList links={companyLinks} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
