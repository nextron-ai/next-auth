// @ts-check

const fs = require("fs")
const path = require("path")

// list providers entries from @auth/core/providers/*.ts
const coreSrc = "../packages/core/src"
const providers = fs
  .readdirSync(path.join(__dirname, coreSrc, "/providers"))
  .filter((file) => file.endsWith(".ts"))
  .map((p) => `${coreSrc}/providers/${p}`)

const typedocConfig = require("./typedoc.json")
// @ts-expect-error
delete typedocConfig.$schema

/**
 * @param {string} name
 * @returns Record<[string, any]>
 */
function typedocAdapter(name) {
  const slug = name.toLowerCase().replace(" ", "-")

  return [
    "docusaurus-plugin-typedoc",
    {
      id: slug,
      plugin: [require.resolve("./typedoc-mdn-links")],
      watch: process.env.TYPEDOC_WATCH,
      entryPoints: [`../packages/adapter-${slug}/src/index.ts`],
      tsconfig: `../packages/adapter-${slug}/tsconfig.json`,
      out: `reference/adapter/${slug}`,
      sidebar: {
        indexLabel: name,
      },
      ...typedocConfig,
    },
  ]
}

/** @type {import("@docusaurus/types").Config} */
const docusaurusConfig = {
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
  title: "Auth.js",
  tagline: "Authentication for the Web.",
  url: "https://authjs.dev",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  organizationName: "nextauthjs",
  // TODO: remove this once ready
  onBrokenLinks: "log",
  projectName: "next-auth",
  themeConfig: {
    prism: {
      theme: require("prism-react-renderer/themes/nightOwl"),
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
      ],
    },
    algolia: {
      appId: "OUEDA16KPG",
      apiKey: "97c0894508f2d1d4a2fef4fe6db28448",
      indexName: "next-auth",
      searchParameters: {},
      contextualSearch: false,
      externalUrlRegex: "authjs\\.dev|next-auth\\.js\\.org",
    },
    navbar: {
      title: "Auth.js",
      logo: {
        alt: "Auth.js Logo",
        src: "img/logo/logo-xs.webp",
      },
      items: [
        {
          to: "/getting-started/introduction",
          activeBasePath: "/getting-started/",
          label: "Getting started",
          position: "left",
        },
        {
          to: "/guides",
          activeBasePath: "/guides",
          label: "Guides",
          position: "left",
        },
        {
          to: "/reference",
          activeBasePath: "/reference",
          label: "API Reference",
          position: "left",
        },
        {
          to: "/concepts/faq",
          activeBasePath: "/concepts",
          label: "Concepts",
          position: "left",
        },
        {
          to: "/security",
          activeBasePath: "/security",
          label: "Security",
          position: "left",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: "https://github.com/nextauthjs/next-auth/releases",
              label: "All Releases",
            },
          ],
        },
        {
          to: "https://www.npmjs.com/package/next-auth",
          label: "npm",
          position: "right",
        },
        {
          to: "https://github.com/nextauthjs/next-auth",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    announcementBar: {
      id: "new-major-announcement",
      content:
        "<a target='_blank' rel='noopener noreferrer' href='https://next-auth.js.org'>NextAuth.js</a> is becoming Auth.js! 🎉 <a target='_blank' rel='noopener noreferrer' href='https://twitter.com/balazsorban44/status/1603082914362986496'>Read the announcement.</a> Note, this site is under active development. 🏗",
      backgroundColor: "#000",
      textColor: "#fff",
    },
    footer: {
      links: [
        {
          title: "About Auth.js",
          items: [
            {
              label: "Introduction",
              to: "/getting-started/introduction",
            },
            {
              html: `
            <a target="_blank" rel="noopener noreferrer" href="https://vercel.com?utm_source=authjs&utm_campaign=oss">
              <img
                alt="Powered by Vercel"
                style="margin-top: 8px"
                height="32"
                width="167"
                src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/docs/static/img/powered-by-vercel.svg"
              />
            </a>`,
            },
          ],
        },
        {
          title: "Download",
          items: [
            {
              label: "GitHub",
              to: "https://github.com/nextauthjs/next-auth",
            },
            {
              label: "NPM",
              to: "https://www.npmjs.com/package/next-auth",
            },
          ],
        },
        {
          title: "Acknowledgements",
          items: [
            {
              label: "Contributors",
              to: "/contributors",
            },
            {
              label: "Sponsors",
              to: "https://opencollective.com/nextauth",
            },
            {
              label: "Images by unDraw",
              to: "https://undraw.co/",
            },
          ],
        },
      ],
      copyright: `Auth.js &copy; Balázs Orbán ${new Date().getFullYear()}`,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          breadcrumbs: false,
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          /**
           *
           * @param {{
           *  version: string;
           *  versionDocsDirPath: string;
           *  docPath: string;
           *  permalink: string;
           *  locale: string;
           *}} params
           */
          editUrl({ docPath }) {
            // TODO: support other packages, fix directory links like "providers"
            if (docPath.includes("reference/core")) {
              const file = docPath.split("reference/core/")[1].replace(".md", ".ts").replace("_", "/")
              const base = `https://github.com/nextauthjs/next-auth/edit/main/packages/core/src/${file}`
              return base
            }
            return "https://github.com/nextauthjs/next-auth/edit/main/docs"
          },
          lastVersion: "current",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [require("@sapphire/docusaurus-plugin-npm2yarn2pnpm").npm2yarn2pnpm],
          versions: {
            current: {
              label: "experimental",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/index.css"),
        },
      },
    ],
  ],
  plugins: [
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        id: "core",
        plugin: [require.resolve("./typedoc-mdn-links")],
        watch: process.env.TYPEDOC_WATCH,
        entryPoints: ["index.ts", "adapters.ts", "errors.ts", "jwt.ts", "types.ts"].map((e) => `${coreSrc}/${e}`).concat(providers),
        tsconfig: "../packages/core/tsconfig.json",
        out: "reference/core",
        sidebar: {
          indexLabel: "index",
        },
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        id: "sveltekit",
        plugin: [require.resolve("./typedoc-mdn-links")],
        watch: process.env.TYPEDOC_WATCH,
        entryPoints: ["index.ts", "client.ts"].map((e) => `../packages/frameworks-sveltekit/src/lib/${e}`),
        tsconfig: "../packages/frameworks-sveltekit/tsconfig.json",
        out: "reference/sveltekit",
        sidebar: {
          indexLabel: "index",
        },
      },
    ],
    ...(process.env.TYPEDOC_SKIP_ADAPTERS
      ? []
      : [
          typedocAdapter("Dgraph"),
          typedocAdapter("Drizzle"),
          typedocAdapter("DynamoDB"),
          typedocAdapter("Fauna"),
          typedocAdapter("Firebase"),
          typedocAdapter("Kysely"),
          typedocAdapter("Mikro ORM"),
          typedocAdapter("MongoDB"),
          typedocAdapter("Neo4j"),
          typedocAdapter("PouchDB"),
          typedocAdapter("Prisma"),
          typedocAdapter("TypeORM"),
          typedocAdapter("Sequelize"),
          typedocAdapter("Supabase"),
          typedocAdapter("Upstash Redis"),
          typedocAdapter("Xata"),
        ]),
  ],
}

docusaurusConfig.headTags = [
  {
    tagName: "meta",
    attributes: {
      charSet: "utf-8",
    },
  },
  {
    tagName: "link",
    attributes: {
      rel: "canonical",
      href: docusaurusConfig.url,
    },
  },
  {
    tagName: "meta",
    attributes: {
      property: "og:title",
      content: docusaurusConfig.title,
    },
  },
  {
    tagName: "meta",
    attributes: {
      property: "og:description",
      content: docusaurusConfig.tagline,
    },
  },
  {
    tagName: "meta",
    attributes: {
      property: "og:image",
      content: `${docusaurusConfig.url}/img/og-image.png`,
    },
  },
  {
    tagName: "meta",
    attributes: {
      property: "og:url",
      content: docusaurusConfig.url,
    },
  },
  {
    tagName: "meta",
    attributes: {
      name: "twitter:card",
      content: "summary_large_image",
    },
  },
  {
    tagName: "meta",
    attributes: {
      name: "twitter:title",
      content: docusaurusConfig.title,
    },
  },
  {
    tagName: "meta",
    attributes: {
      name: "twitter:description",
      content: docusaurusConfig.tagline,
    },
  },
  {
    tagName: "meta",
    attributes: {
      name: "twitter:image",
      content: `${docusaurusConfig.url}/img/og-image.png`,
    },
  },
]

module.exports = docusaurusConfig
