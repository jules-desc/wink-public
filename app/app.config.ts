// Thème Nuxt UI aligné sur le design system Mon Employeur Public
// (docs/design-system). Palettes définies dans app/assets/css/main.css.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'encre',
      secondary: 'vermillon',
      neutral: 'papier'
    },

    // Angles francs, graisse 600, survol un cran plus foncé.
    button: {
      slots: {
        base: 'rounded-none font-semibold duration-[120ms]'
      },
      variants: {
        size: {
          sm: { base: 'min-h-8 px-3 py-1.5 text-sm gap-1.5' },
          md: { base: 'min-h-10 px-4 py-2 text-[15px] gap-2' },
          lg: { base: 'min-h-12 px-6 py-3 text-[17px] gap-2.5' },
          xl: { base: 'min-h-14 px-6 py-3 text-[17px] gap-2.5' }
        }
      },
      compoundVariants: [
        { color: 'primary', variant: 'solid', class: 'hover:bg-primary-900 active:bg-primary-950' },
        { color: 'primary', variant: 'outline', class: 'ring-primary hover:bg-primary-50 active:bg-primary-100' },
        { color: 'neutral', variant: 'outline', class: 'text-primary ring-default bg-default hover:bg-elevated' },
        { color: 'neutral', variant: 'ghost', class: 'text-highlighted hover:bg-elevated active:bg-accented' }
      ]
    },

    badge: {
      slots: {
        base: 'font-semibold rounded-[2px]'
      },
      variants: {
        size: {
          sm: { base: 'text-xs/4 px-1.5 py-0.5 rounded-[2px]' },
          md: { base: 'text-[13px]/[18px] px-2 py-[3px] rounded-[2px]' },
          lg: { base: 'text-sm px-2.5 py-1 rounded-[2px]' }
        }
      }
    },

    card: {
      slots: {
        root: 'rounded-none'
      }
    },

    // Carré par défaut (collectivités) ; logos et blasons jamais recadrés.
    avatar: {
      slots: {
        root: 'rounded-none bg-default ring ring-inset ring-default',
        image: 'object-contain p-[9%]'
      }
    },

    input: {
      slots: {
        base: 'rounded-none'
      }
    },

    breadcrumb: {
      slots: {
        link: 'text-[13px] text-muted underline underline-offset-3 hover:decoration-2',
        separatorIcon: 'size-3.5 text-dimmed'
      },
      variants: {
        active: {
          true: { link: 'text-highlighted font-medium no-underline' }
        }
      }
    },

    skeleton: {
      base: 'rounded-none bg-accented'
    },

    empty: {
      slots: {
        root: 'rounded-none bg-muted ring ring-inset ring-default py-12',
        title: 'text-lg font-bold',
        description: 'text-muted text-[15px]'
      }
    }
  }
})
