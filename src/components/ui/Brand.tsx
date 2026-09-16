import { useId } from 'react'
import { cn } from '../../lib/utils'
import { Penguin } from './Penguin'

// ─── VDURA ──────────────────────────────────────────────────────────────────
// Official VDURA wordmark and "V" mark, ported path-for-path from the vdura-ui
// repo (src/components/icons/IconLogoBig.tsx / IconLogoSmall.tsx). VDURA Gold
// #E79F23 is baked into the artwork; size it with a height class.

function svgId() {
  // useId() emits colons, which break url(#…) references inside SVG.
  return useId().replace(/:/g, '')
}

export function VduraLogo({ className, title = 'VDURA' }: { className?: string; title?: string }) {
  const id = svgId()
  return (
    <svg viewBox="0 0 181 32" className={cn('inline-block h-6 w-auto shrink-0', className)} role="img" aria-label={title}>
      <path
        d="M168.842 12.765L166.648 9.49442L164.61 6.46107L160.631 0.545607C160.243 -0.0296319 159.398 -0.0296319 159.012 0.545607L139.155 30.0725C138.716 30.7219 139.181 31.5907 139.961 31.5907H148.474C149.017 31.5907 149.521 31.3149 149.808 30.8524L159.333 15.659C159.386 15.573 159.445 15.4899 159.493 15.404C160.975 13.0793 161.479 12.0356 163.359 11.3684C164.124 11.0956 167.083 10.9948 168.836 12.765H168.842Z"
        fill="#E79F23"
      />
      <mask
        id={`${id}-mask0_30_23319`}
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="159"
        y="11"
        width="22"
        height="21"
      >
        <path
          d="M168.839 12.765C167.086 10.9978 164.127 11.0956 163.362 11.3684C161.482 12.0386 160.978 13.0793 159.496 15.404C159.647 15.1668 159.997 15.1668 160.145 15.407L169.832 30.8495C170.117 31.312 170.624 31.5878 171.166 31.5878H179.676C180.456 31.5878 180.922 30.719 180.489 30.0696L168.845 12.7621"
          fill="white"
        />
      </mask>
      <g mask={`url(#${id}-mask0_30_23319)`}>
        <rect x="153.002" y="8.7738e-05" width="34.9887" height="32.6166" fill={`url(#${id}-paint0_linear_30_23319)`} />
      </g>
      <path
        d="M122.968 15.4781H128.854C128.854 15.4781 132.053 15.4959 133.227 15.3654L133.788 15.318C139.087 14.7368 144.359 13.4974 147.155 9.9896C147.184 9.95402 147.211 9.90954 147.241 9.86506C147.327 9.74646 147.401 9.62192 147.475 9.49739C147.297 10.0519 147.072 10.6152 146.799 11.2083C145.53 13.9332 143.683 16.3439 141.307 18.378C139.356 20.0474 137.316 21.0466 134.832 21.9332C134.425 22.0785 134.161 22.4699 134.194 22.8969L134.74 30.5025C134.778 31.057 134.339 31.5225 133.791 31.5225H126.159C125.631 31.5225 125.207 31.0955 125.21 30.5737L125.222 23.6085C125.222 23.0896 124.806 22.6656 124.29 22.6567L119.597 22.5559C119.247 22.547 118.924 22.7279 118.752 23.0333L114.156 31.0332C113.987 31.3268 113.675 31.5106 113.334 31.5106L105.477 31.5255C104.747 31.5255 104.285 30.7338 104.649 30.0992L112.744 15.9584C112.768 15.9169 112.795 15.8784 112.824 15.8398C114.224 13.4025 116.279 9.78501 116.557 9.30465L121.557 0.56933C121.726 0.272816 122.04 0.0919418 122.384 0.0919418H138.274L135.149 7.52556L128.16 7.55522C127.831 7.55818 127.525 7.73312 127.353 8.01185L122.977 15.4811L122.968 15.4781Z"
        fill="#E79F23"
      />
      <mask
        id={`${id}-mask1_30_23319`}
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="131"
        y="0"
        width="17"
        height="16"
      >
        <path
          d="M137.322 12.0474C138.861 10.2654 138.47 9.04372 138.47 9.04372C138.165 7.46033 135.143 7.51963 135.143 7.51963H134.571L137.672 0.08601H138.268C142.458 0.08601 145.251 1.04375 146.805 3.01854C148.116 4.68792 148.335 6.86137 147.475 9.49442C147.401 9.62192 147.33 9.75535 147.244 9.87692C147.244 9.87692 147.11 10.0726 146.814 10.4166C142.292 15.6797 131.348 15.4573 131.306 15.4573C131.306 15.4573 135.537 14.12 137.322 12.0474Z"
          fill="white"
        />
      </mask>
      <g mask={`url(#${id}-mask1_30_23319)`}>
        <rect x="115.048" y="-0.000282288" width="34.9887" height="32.6166" fill={`url(#${id}-paint1_linear_30_23319)`} />
      </g>
      <mask
        id={`${id}-mask2_30_23319`}
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="83"
        y="0"
        width="33"
        height="30"
      >
        <path
          d="M114.535 0.0712318H107.478C106.808 0.0712318 106.188 0.427049 105.853 1.00822L96.6431 16.9073C94.695 20.3202 91.4838 23.3328 87.5194 23.4218C86.9056 23.4366 86.274 23.3862 85.6276 23.2498C84.9545 23.1104 84.1094 22.8317 83.7773 22.2387C84.575 26.8673 89.2688 29.3758 94.9144 29.871C95.6083 29.5478 96.2784 29.189 96.9218 28.7768C99.6646 27.0244 103.172 23.1816 105.248 19.3388C105.245 19.3388 105.242 19.3388 105.239 19.3417C105.565 18.7991 105.891 18.2505 106.212 17.6842L115.368 1.48857C115.727 0.854031 115.267 0.0712318 114.541 0.0712318H114.535Z"
          fill="white"
        />
      </mask>
      <g mask={`url(#${id}-mask2_30_23319)`}>
        <rect x="81.8379" width="34.9887" height="32.6166" fill={`url(#${id}-paint2_linear_30_23319)`} />
      </g>
      <path
        d="M94.9058 29.8681C91.5374 31.4337 87.6294 32 83.6205 32C80.7799 32 78.4967 31.5315 76.768 30.5945C75.0393 29.6575 73.9333 28.3291 73.4559 26.6034C72.9786 24.8807 73.1594 22.8585 73.9986 20.5397C74.3425 19.5879 74.8614 18.4878 75.5553 17.2395L84.7235 1.02311C85.0556 0.43305 85.6812 0.0683365 86.3573 0.0683365H93.1297C93.8651 0.0683365 94.3276 0.860031 93.9659 1.5005L92.0356 4.91635C90.4878 7.65615 88.9399 10.3989 87.3921 13.1387C86.8317 14.1291 86.2743 15.1165 85.7139 16.1068C84.8451 17.6457 83.834 19.2261 83.6976 21.0319C83.6976 21.0319 82.9592 28.5515 94.9029 29.8651L94.9058 29.8681Z"
        fill="#E79F23"
      />
      <mask
        id={`${id}-mask3_30_23319`}
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="49"
        y="9"
        width="19"
        height="23"
      >
        <path
          d="M49.0083 31.4574C56.8333 31.149 61.8059 30.0341 65.1179 26.4819C65.3166 26.2684 65.5093 26.0579 65.7021 25.8444C68.7858 20.3796 67.9615 13.3937 64.6079 9.95119C64.7473 11.585 63.7362 14.2744 62.8941 15.6354C61.9452 17.1565 60.3352 19.1965 58.9504 20.3411C58.6954 20.5664 58.4375 20.771 58.1765 20.9667C55.6235 22.8644 52.8007 23.2706 49.542 23.2706L49.0113 31.4604L49.0083 31.4574Z"
          fill="white"
        />
      </mask>
      <g mask={`url(#${id}-mask3_30_23319)`}>
        <rect x="47.146" y="10.0815" width="23.4247" height="24.9072" fill={`url(#${id}-paint3_linear_30_23319)`} />
      </g>
      <path
        d="M49.5364 23.2675C47.3926 23.2675 43.7989 23.2438 42.6691 23.2379C42.5565 23.2379 42.4764 23.143 42.4794 23.0422C42.4794 23.0096 42.4912 22.974 42.512 22.9443C43.0931 22.0726 44.896 19.3802 46.847 16.4655L52.7447 7.70051C52.9196 7.52853 53.1509 7.42475 53.403 7.42178L55.3629 7.40696C57.4 7.39213 59.5171 7.43661 61.4948 7.95551C63.2324 8.41214 64.546 9.67826 65.5186 11.1519C66.8588 13.1831 67.5408 15.659 67.5348 18.4462C67.5319 20.9962 66.8558 23.6382 65.6965 25.8472C65.8032 25.7256 66.0345 25.4647 66.1738 25.3135C66.414 25.0496 66.6423 24.7768 66.8736 24.504C67.3065 23.991 67.7305 23.4721 68.1427 22.9414C68.9285 21.9332 69.6727 20.8924 70.3606 19.8161C71.5734 17.9184 72.6349 15.8962 73.3139 13.7435C73.5037 13.1416 73.6638 12.5278 73.7824 11.9081C75.0545 5.20089 70.9566 0.109732 57.8952 0.0474635L48.8248 2.11905e-05C48.1991 -0.00294396 47.615 0.305431 47.2651 0.824332C43.7247 6.0845 31.2652 24.6137 27.6477 29.9984C27.2237 30.627 27.6774 31.4751 28.4364 31.478C29.0739 31.478 29.6996 31.481 30.3163 31.4869C30.3371 31.4869 30.3549 31.4869 30.3756 31.4869C37.9368 31.5255 44.045 31.6559 49.0057 31.4602L49.3733 31.4424L49.8596 23.2705H49.5394L49.5364 23.2675Z"
        fill="#E79F23"
      />
      <mask
        id={`${id}-mask4_30_23319`}
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="20"
        y="0"
        width="22"
        height="21"
      >
        <path
          d="M29.8505 18.9386C28.0981 20.7059 25.1389 20.608 24.3739 20.3352C22.494 19.6651 21.9899 18.6243 20.5073 16.2997C20.6585 16.5369 21.0084 16.5369 21.1567 16.2967L30.8438 0.851252C31.1285 0.388689 31.6355 0.11293 32.1781 0.11293H40.6881C41.4679 0.11293 41.9335 0.981718 41.5006 1.63109L29.8564 18.9386"
          fill="white"
        />
      </mask>
      <g mask={`url(#${id}-mask4_30_23319)`}>
        <rect x="13.6401" y="-1.48257" width="29.0584" height="22.8316" fill={`url(#${id}-paint4_linear_30_23319)`} />
      </g>
      <path
        d="M29.8534 18.9386L27.6592 22.2092L25.6222 25.2425L21.6429 31.158C21.2545 31.7333 20.4094 31.7333 20.024 31.158L0.169333 1.63109C-0.269509 0.981718 0.196019 0.11293 0.975853 0.11293H9.48879C10.0314 0.11293 10.5355 0.388689 10.8231 0.851252L20.3472 16.0447C20.4005 16.1307 20.4598 16.2137 20.5073 16.2997C21.9898 18.6243 22.4939 19.6681 24.3738 20.3352C25.1388 20.608 28.098 20.7088 29.8504 18.9386H29.8534Z"
        fill="#E79F23"
      />
      <defs>
        <linearGradient
          id={`${id}-paint0_linear_30_23319`}
          x1="161.304"
          y1="14.5293"
          x2="168.272"
          y2="24.3143"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E79F23" stopOpacity="0" />
          <stop offset="1" stopColor="#E79F23" />
        </linearGradient>
        <linearGradient
          id={`${id}-paint1_linear_30_23319`}
          x1="139.511"
          y1="15.122"
          x2="138.918"
          y2="7.26433"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E79F23" stopOpacity="0" />
          <stop offset="1" stopColor="#E79F23" />
        </linearGradient>
        <linearGradient
          id={`${id}-paint2_linear_30_23319`}
          x1="84.21"
          y1="20.4595"
          x2="100.815"
          y2="20.0147"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E79F23" stopOpacity="0" />
          <stop offset="1" stopColor="#E79F23" />
        </linearGradient>
        <linearGradient
          id={`${id}-paint3_linear_30_23319`}
          x1="49.3699"
          y1="23.2764"
          x2="59.7479"
          y2="8.89544"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E79F23" />
          <stop offset="1" stopColor="#E79F23" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${id}-paint4_linear_30_23319`}
          x1="35.8787"
          y1="11.2676"
          x2="28.4659"
          y2="22.2386"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E79F23" />
          <stop offset="1" stopColor="#E79F23" stopOpacity="0" />
        </linearGradient>
      </defs>
    
    </svg>
  )
}

export function VduraMark({ className }: { className?: string }) {
  const id = svgId()
  return (
    <svg viewBox="0 0 42 32" className={cn('inline-block h-5 w-auto shrink-0', className)} aria-hidden="true">
      <mask
        id={`${id}-mask0_106_3985`}
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="20"
        y="0"
        width="22"
        height="21"
      >
        <path
          d="M29.85 18.8257C28.0976 20.5929 25.1384 20.4951 24.3734 20.2223C22.4935 19.5522 21.9894 18.5114 20.5068 16.1867C20.6581 16.4239 21.0079 16.4239 21.1562 16.1838L30.8433 0.738321C31.128 0.275759 31.635 0 32.1777 0H40.6876C41.4675 0 41.933 0.868788 41.5001 1.51815L29.8559 18.8257"
          fill="white"
        />
      </mask>
      <g mask={`url(#${id}-mask0_106_3985)`}>
        <rect x="13.6396" y="-1.5955" width="29.0584" height="22.8316" fill={`url(#${id}-paint0_linear_106_3985)`} />
      </g>
      <path
        d="M29.8534 18.8257L27.6592 22.0963L25.6222 25.1296L21.6429 31.0451C21.2545 31.6203 20.4094 31.6203 20.024 31.0451L0.169333 1.51815C-0.269509 0.868788 0.196019 0 0.975853 0H9.48879C10.0314 0 10.5355 0.275759 10.8231 0.738321L20.3472 15.9317C20.4005 16.0177 20.4598 16.1007 20.5073 16.1867C21.9898 18.5114 22.4939 19.5551 24.3738 20.2223C25.1388 20.4951 28.098 20.5959 29.8504 18.8257H29.8534Z"
        fill="#E79F23"
      />
      <defs>
        <linearGradient
          id={`${id}-paint0_linear_106_3985`}
          x1="35.8782"
          y1="11.1546"
          x2="28.4654"
          y2="22.1257"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E79F23" />
          <stop offset="1" stopColor="#E79F23" stopOpacity="0" />
        </linearGradient>
      </defs>
    
    </svg>
  )
}

// ─── Penguin Computing ──────────────────────────────────────────────────────

/**
 * Penguin Computing lockup. Drop the official logo at /public/penguin-computing.svg
 * and swap the wordmark below for an <img> if brand wants the real thing.
 */
export function Wordmark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('shrink-0 rounded-2xl bg-yellow p-1.5', size === 'sm' && 'rounded-xl p-1', size === 'lg' && 'rounded-3xl p-2')}>
        <Penguin className={cn(size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-16 w-16' : 'h-10 w-10')} />
      </div>
      <div className="leading-none">
        <div className={cn('font-black uppercase tracking-[0.18em] text-snow', size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-3xl md:text-4xl' : 'text-lg')}>
          Penguin
        </div>
        <div className={cn('font-bold uppercase tracking-[0.32em] text-yellow', size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-base md:text-lg' : 'text-xs')}>
          Computing
        </div>
      </div>
    </div>
  )
}

// ─── Co-branding ────────────────────────────────────────────────────────────

/** Penguin Computing hosts the game; VDURA is the storage being sold. */
export function CoBrand({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center', size === 'sm' ? 'gap-x-3 gap-y-2' : size === 'lg' ? 'gap-x-8 gap-y-4' : 'gap-x-5 gap-y-3', className)}>
      <Wordmark size={size} />
      <span aria-hidden="true" className={cn('font-light leading-none text-muted/70', size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-5xl md:text-6xl' : 'text-3xl')}>
        ×
      </span>
      <div className="flex flex-col items-start leading-none">
        <VduraLogo className={size === 'sm' ? 'h-5' : size === 'lg' ? 'h-10 md:h-12' : 'h-7'} />
        {size !== 'sm' && (
          <span className={cn('mt-2 font-semibold uppercase tracking-[0.32em] text-vdura', size === 'lg' ? 'text-xs md:text-sm' : 'text-[10px]')}>
            Velocity • Durability
          </span>
        )}
      </div>
    </div>
  )
}

/** "VDURA Mixed Fleet" product pill. `detail` adds e.g. "20% flash / 80% HDD". */
export function MixedFleetBadge({ className, detail }: { className?: string; detail?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border border-vdura/50 bg-vdura/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-vdura', className)}>
      <VduraMark className="h-3.5" />
      <span>
        Mixed Fleet
        {detail && <span className="font-semibold text-vdura/80"> · {detail}</span>}
      </span>
    </span>
  )
}

export function PoweredBy({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs font-medium uppercase tracking-widest text-muted', className)}>
      <span>Storage by</span>
      <VduraLogo className="h-4" />
      <span className="text-muted/70">Mixed Fleet · SSD + HDD in one namespace</span>
    </div>
  )
}
