import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { serverContentInterceptor } from './core/content/server-content.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Content JSON is read from disk while prerendering.
    provideHttpClient(withFetch(), withInterceptors([serverContentInterceptor])),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
