/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_chat from "../actions/chat.js";
import type * as actions_notifications from "../actions/notifications.js";
import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as mutations_contactSubmissions from "../mutations/contactSubmissions.js";
import type * as mutations_demoClicks from "../mutations/demoClicks.js";
import type * as mutations_emailOutreach from "../mutations/emailOutreach.js";
import type * as mutations_leadScoring from "../mutations/leadScoring.js";
import type * as mutations_leads from "../mutations/leads.js";
import type * as mutations_pageViews from "../mutations/pageViews.js";
import type * as mutations_reviews from "../mutations/reviews.js";
import type * as mutations_visitors from "../mutations/visitors.js";
import type * as queries_adminDashboard from "../queries/adminDashboard.js";
import type * as queries_analytics from "../queries/analytics.js";
import type * as queries_contactSubmissions from "../queries/contactSubmissions.js";
import type * as queries_emailOutreach from "../queries/emailOutreach.js";
import type * as queries_leads from "../queries/leads.js";
import type * as queries_reviews from "../queries/reviews.js";
import type * as queries_visitors from "../queries/visitors.js";
import type * as router from "../router.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/chat": typeof actions_chat;
  "actions/notifications": typeof actions_notifications;
  auth: typeof auth;
  crons: typeof crons;
  http: typeof http;
  "mutations/contactSubmissions": typeof mutations_contactSubmissions;
  "mutations/demoClicks": typeof mutations_demoClicks;
  "mutations/emailOutreach": typeof mutations_emailOutreach;
  "mutations/leadScoring": typeof mutations_leadScoring;
  "mutations/leads": typeof mutations_leads;
  "mutations/pageViews": typeof mutations_pageViews;
  "mutations/reviews": typeof mutations_reviews;
  "mutations/visitors": typeof mutations_visitors;
  "queries/adminDashboard": typeof queries_adminDashboard;
  "queries/analytics": typeof queries_analytics;
  "queries/contactSubmissions": typeof queries_contactSubmissions;
  "queries/emailOutreach": typeof queries_emailOutreach;
  "queries/leads": typeof queries_leads;
  "queries/reviews": typeof queries_reviews;
  "queries/visitors": typeof queries_visitors;
  router: typeof router;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
