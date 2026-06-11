import crypto from "crypto";

function getConfig() {
  const apiKey = process.env.FLOW_API_KEY;
  const secretKey = process.env.FLOW_SECRET_KEY;
  const baseUrl = process.env.FLOW_SANDBOX_URL || process.env.FLOW_PROD_URL;
  const webhookUrl =
    process.env.FLOW_WEBHOOK_URL || "http://localhost:3000";

  if (!apiKey || !secretKey || !baseUrl) {
    throw new Error(
      "Faltan variables de entorno FLOW_API_KEY, FLOW_SECRET_KEY y FLOW_SANDBOX_URL/FLOW_PROD_URL",
    );
  }

  return { apiKey, secretKey, baseUrl, webhookUrl };
}

function buildSignature(
  params: Record<string, string | number>,
  secretKey: string,
): string {
  const keys = Object.keys(params).sort();
  const toSign = keys.map((k) => k + String(params[k])).join("");
  return crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");
}

async function request<T>(
  endpoint: string,
  bodyParams: Record<string, string | number>,
): Promise<T> {
  const { apiKey, secretKey, baseUrl } = getConfig();

  const withKey: Record<string, string | number> = { ...bodyParams, apiKey };
  const signature = buildSignature(withKey, secretKey);
  withKey.s = signature;

  const url = `${baseUrl}/${endpoint}`;
  const encodedBody = new URLSearchParams(
    Object.entries(withKey).map(([k, v]) => [k, String(v)]),
  );

  console.log(`[DEBUG Flow POST] ${url} body:`, encodedBody.toString());

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodedBody,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Flow API error ${res.status}: ${body}`);
  }

  return res.json();
}

async function get<T>(
  endpoint: string,
  queryParams: Record<string, string | number>,
): Promise<T> {
  const { apiKey, secretKey, baseUrl } = getConfig();

  const withKey: Record<string, string | number> = { ...queryParams, apiKey };
  const signature = buildSignature(withKey, secretKey);
  withKey.s = signature;

  const qs = new URLSearchParams(
    Object.entries(withKey).map(([k, v]) => [k, String(v)]),
  );
  const url = `${baseUrl}/${endpoint}?${qs.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Flow API error ${res.status}: ${body}`);
  }

  return res.json();
}

export type FlowCustomer = {
  customerId: string;
  created: string;
  email: string;
  name: string;
  pay_mode: string;
  creditCardType: string;
  last4CardDigits: string;
  externalId: string;
  status: string;
  registerDate: string;
};

export type FlowSubscription = {
  subscriptionId: string;
  planId: string;
  plan_name: string;
  customerId: string;
  created: string;
  subscription_start: string;
  subscription_end: string;
  status: number;
  cancel_at_period_end: number;
  periods_number: number;
  invoices: Array<{
    id: number;
    status: number;
    amount: number;
    currency: string;
    period_start: string;
    period_end: string;
  }>;
};

export type FlowPaymentStatus = {
  flowOrder: number;
  commerceOrder: string;
  requestDate: string;
  status: number;
  subject: string;
  currency: string;
  amount: number;
  payer: string;
};

export type FlowPlan = {
  planId: string;
  name: string;
  currency: string;
  amount: number;
  interval: number;
  interval_count: number;
  created: string;
  trial_period_days: number;
  status: number;
};

export async function createCustomer(
  name: string,
  email: string,
  externalId: string,
): Promise<FlowCustomer> {
  return request<FlowCustomer>("customer/create", {
    name,
    email,
    externalId,
  });
}

export async function createSubscription(
  planId: string,
  customerId: string,
  subscription_start?: string,
): Promise<FlowSubscription> {
  const params: Record<string, string | number> = {
    planId,
    customerId,
  };
  if (subscription_start) {
    params.subscription_start = subscription_start;
  }
  return request<FlowSubscription>("subscription/create", params);
}

export async function cancelSubscription(
  subscriptionId: string,
  atPeriodEnd: 0 | 1 = 1,
): Promise<FlowSubscription> {
  return request<FlowSubscription>("subscription/cancel", {
    subscriptionId,
    at_period_end: atPeriodEnd,
  });
}

export async function getSubscription(
  subscriptionId: string,
): Promise<FlowSubscription> {
  return get<FlowSubscription>("subscription/get", {
    subscriptionId,
  });
}

export async function getPaymentStatus(
  token: string,
): Promise<FlowPaymentStatus> {
  return get<FlowPaymentStatus>("payment/getStatus", {
    token,
  });
}

export async function createPlan(
  planId: string,
  name: string,
  amount: number,
  currency = "CLP",
  interval = 3,
  intervalCount = 1,
): Promise<FlowPlan> {
  const { webhookUrl } = getConfig();
  return request<FlowPlan>("plans/create", {
    planId,
    name,
    amount,
    currency,
    interval,
    interval_count: intervalCount,
    urlCallback: `${webhookUrl}/api/webhooks/flow`,
  });
}

export async function getPlan(planId: string): Promise<FlowPlan> {
  return get<FlowPlan>("plans/get", { planId });
}

export async function ensurePlan(
  planId: string,
  name = "Plan Premium",
  amount = 1,
  currency = "CLP",
): Promise<FlowPlan> {
  try {
    return await getPlan(planId);
  } catch {
    return createPlan(planId, name, amount, currency);
  }
}
