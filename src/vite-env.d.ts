/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_STORE_URL?: string;
  readonly VITE_PLAY_STORE_URL?: string;
  readonly VITE_TESTFLIGHT_URL?: string;
  readonly VITE_CHROME_STORE_URL?: string;
  readonly VITE_DOCS_URL?: string;
  readonly VITE_RAISE_URL?: string;
  readonly VITE_PARTNERS_API_URL?: string;
  readonly VITE_GAMI_TOKEN_ADDRESS?: string;
  readonly VITE_GAMI_TOKEN_CHAIN?: string;
  readonly VITE_SEED_GAMI_WHOLE?: string;
  readonly VITE_SEED_USDC_UNITS?: string;
  readonly VITE_PRIVY_APP_ID?: string;
  readonly VITE_MAIN_SITE_URL?: string;
  readonly VITE_RAISE_SITE_URL?: string;
}
