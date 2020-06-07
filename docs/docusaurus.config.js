module.exports = {
  title: 'Power+ Documentation',
  tagline: 'Source code guides, reference, and documentation for Power+ v3 (beta)',
  url: 'https://docs.powerplus.app',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'jottocraft', // Usually your GitHub org/user name.
  projectName: 'dtps', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Power+ Docs',
      logo: {
        alt: 'Power+ Logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/guides/getting-started',
          activeBasePath: 'docs/guides',
          label: 'Guides',
          position: 'left',
        },
        {
          to: 'docs/reference',
          activeBasePath: 'docs/reference',
          label: 'Reference',
          position: 'left',
        },
        {
          href: 'https://github.com/jottocraft/dtps',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guides',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/guides/getting-started',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Main Power+ website',
              href: 'https://powerplus.app',
            },
            {
              label: 'Chrome Extension',
              href: 'https://chrome.google.com/webstore/detail/power+/pakgdifknldaiglefmpkkgfjndemfapo',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/jottocraft/dtps',
            },
          ],
        },
      ],
      logo: {
        alt: 'jottocraft logo',
        src: 'https://i.imgur.com/ErYQXd8.png',
        href: 'https://jottocraft.com',
      },
      copyright: `Copyright (c) jottocraft 2018-${new Date().getFullYear()}. All rights reserved. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/jottocraft/dtps/edit/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
