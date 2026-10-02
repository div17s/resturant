export type AnalyticsEventType =
  | 'page_view'
  | 'menu_view'
  | 'category_select'
  | 'dish_view'
  | 'reserve_click'
  | 'reservation_started'
  | 'reservation_completed'
  | 'reservation_cancelled'
  | 'phone_click'
  | 'direction_click'
  | 'order_started'
  | 'cart_add'
  | 'checkout_started'
  | 'order_completed'
  | 'newsletter_signup';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'ember_analytics_events';

class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.loadEvents();
  }

  private loadEvents() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.events = JSON.parse(data);
      }
    } catch {
      this.events = [];
    }
  }

  public track(type: AnalyticsEventType, metadata?: Record<string, any>) {
    const event: AnalyticsEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      type,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.events.unshift(event);
    if (this.events.length > 200) {
      this.events = this.events.slice(0, 200);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
    } catch {
      // quota or private browsing guard
    }

    // In production, dispatch to backend telemetry or Google Analytics (gtag)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', type, metadata);
    }
  }

  public getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  public getSummary() {
    const counts: Record<string, number> = {};
    for (const e of this.events) {
      counts[e.type] = (counts[e.type] || 0) + 1;
    }
    return {
      total: this.events.length,
      counts,
      recent: this.events.slice(0, 15),
    };
  }
}

export const analytics = new AnalyticsService();
