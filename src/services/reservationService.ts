import { analytics } from './analyticsService';

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

export interface ReservationRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  specialRequest?: string;
  tableAllocated?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'No-show';
  createdAt: string;
}

const STORAGE_KEY = 'ember_reservations_data';

const INITIAL_RESERVATIONS: ReservationRecord[] = [
  {
    id: 'EO-RES-801',
    fullName: 'Aarav Mehta',
    phone: '+91 00000 00000',
    email: 'aarav.m@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: 2,
    occasion: 'Casual Dining',
    specialRequest: 'Window table preferred',
    tableAllocated: 'Table 4 (Window)',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'EO-RES-802',
    fullName: 'Priya & Vikram Sharma',
    phone: '+91 00000 00000',
    email: 'priya.sharma@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 6,
    occasion: 'Anniversary',
    specialRequest: 'Floral arrangement requested',
    tableAllocated: 'Private Dining Enclave',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'EO-RES-803',
    fullName: 'Dr. Siddharth Kapoor',
    phone: '+91 00000 00000',
    email: 'siddharth.k@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '20:30',
    guests: 4,
    occasion: "Chef's Tasting",
    specialRequest: 'Nut allergy noted for 1 guest',
    tableAllocated: "Chef's Counter",
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

class ReservationService {
  private localReservations: ReservationRecord[] = [];

  constructor() {
    this.loadLocalFallback();
  }

  private loadLocalFallback() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.localReservations = JSON.parse(data);
      } else {
        this.localReservations = INITIAL_RESERVATIONS;
        this.saveLocalFallback();
      }
    } catch {
      this.localReservations = INITIAL_RESERVATIONS;
    }
  }

  private saveLocalFallback() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.localReservations));
    } catch {
      // ignore
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getAdminAuth(): boolean {
    return localStorage.getItem('ember_admin_auth') === 'true';
  }

  private getUserProfile(): { email?: string } | null {
    try {
      const raw = localStorage.getItem('ember_user_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private getRequestHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Check real-time table availability
   */
  public async checkAvailability(
    date: string,
    time: string,
    guests: number
  ): Promise<{ status: AvailabilityStatus; remainingTables: number; message: string }> {
    try {
      // Fetch latest list to check remaining count
      const allRes = await this.getAllReservations();
      const existing = allRes.filter(
        (r) => r.date === date && r.time === time && r.status !== 'Cancelled'
      );

      const totalTables = 12;
      const bookedTables = existing.length;
      const remaining = totalTables - bookedTables;

      if (remaining <= 0 || guests > 14) {
        return {
          status: 'unavailable',
          remainingTables: 0,
          message: 'No tables available for this time slot. Please choose another time.',
        };
      }

      if (remaining <= 3) {
        return {
          status: 'limited',
          remainingTables: remaining,
          message: `High demand: Only ${remaining} tables remaining for ${time}.`,
        };
      }

      return {
        status: 'available',
        remainingTables: remaining,
        message: `Excellent availability for a party of ${guests}.`,
      };
    } catch {
      // Fail gracefully to available
      return {
        status: 'available',
        remainingTables: 8,
        message: `Excellent availability for a party of ${guests}.`,
      };
    }
  }

  /**
   * Create a new table reservation synced with backend store
   */
  public async createReservation(
    data: Omit<ReservationRecord, 'id' | 'status' | 'createdAt' | 'tableAllocated'>
  ): Promise<ReservationRecord> {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation on backend');
      }

      const newRecord = await response.json();
      
      // Also save to local fallbacks
      this.localReservations.unshift(newRecord);
      this.saveLocalFallback();

      analytics.track('reservation_completed', {
        reservationId: newRecord.id,
        guests: data.guests,
        date: data.date,
        time: data.time,
      });

      return newRecord;
    } catch (error) {
      console.warn('Backend unavailable, saving locally:', error);
      const id = 'EO-RES-' + Math.floor(1000 + Math.random() * 9000);
      const tableAllocated =
        data.guests > 8
          ? 'Private Dining Enclave'
          : `Table ${Math.floor(1 + Math.random() * 10)}`;

      const fallbackRecord: ReservationRecord = {
        ...data,
        id,
        status: 'Confirmed',
        tableAllocated,
        createdAt: new Date().toISOString(),
      };

      this.localReservations.unshift(fallbackRecord);
      this.saveLocalFallback();
      return fallbackRecord;
    }
  }

  /**
   * Get single reservation by ID
   */
  public getReservation(id: string): ReservationRecord | undefined {
    return this.localReservations.find((r) => r.id === id);
  }

  /**
   * Get all reservations. 
   * Strict privacy check: Non-admins can only see their own reservations!
   */
  public async getAllReservations(): Promise<ReservationRecord[]> {
    const isAdmin = this.getAdminAuth();
    const user = this.getUserProfile();
    const email = user?.email;

    try {
      let url = '/api/reservations';
      // If NOT admin but has an email, restrict the API query to their own email!
      if (!isAdmin && email) {
        url += `?email=${encodeURIComponent(email)}`;
      } else if (!isAdmin && !email) {
        // Safe protection: Anonymous user with no email can't see anything!
        return [];
      }

      const response = await fetch(url, {
        headers: this.getRequestHeaders(),
      });

      if (response.ok) {
        const remoteReservations = await response.json();
        // Sync local cache
        this.localReservations = remoteReservations;
        this.saveLocalFallback();
        return remoteReservations;
      }
    } catch (error) {
      console.warn('Failed to load reservations from backend:', error);
    }

    // Secure local fallback filtering
    if (isAdmin) {
      return [...this.localReservations];
    } else if (email) {
      return this.localReservations.filter(r => r.email.toLowerCase() === email.toLowerCase());
    }
    return [];
  }

  /**
   * Cancel reservation
   */
  public async cancelReservation(id: string, reason?: string): Promise<boolean> {
    try {
      const user = this.getUserProfile();
      let url = `/api/reservations/${id}`;
      if (user?.email) {
        url += `?email=${encodeURIComponent(user.email)}`;
      }

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      if (response.ok) {
        analytics.track('reservation_cancelled', { reservationId: id, reason });
        await this.getAllReservations();
        return true;
      }
    } catch (error) {
      console.warn('Failed backend cancel, applying locally:', error);
    }

    const target = this.localReservations.find((r) => r.id === id);
    if (!target) return false;

    target.status = 'Cancelled';
    this.saveLocalFallback();
    analytics.track('reservation_cancelled', { reservationId: id, reason });
    return true;
  }

  /**
   * Modify reservation (Admin or Owner)
   */
  public async modifyReservation(
    id: string,
    updates: Partial<Omit<ReservationRecord, 'id' | 'createdAt'>>
  ): Promise<ReservationRecord | null> {
    try {
      const user = this.getUserProfile();
      let url = `/api/reservations/${id}`;
      if (user?.email) {
        url += `?email=${encodeURIComponent(user.email)}`;
      }

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getRequestHeaders(),
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updated = await response.json();
        await this.getAllReservations();
        return updated;
      }
    } catch (error) {
      console.warn('Failed to modify on backend, applying locally:', error);
    }

    const targetIndex = this.localReservations.findIndex((r) => r.id === id);
    if (targetIndex === -1) return null;

    this.localReservations[targetIndex] = {
      ...this.localReservations[targetIndex],
      ...updates,
    };
    this.saveLocalFallback();
    return this.localReservations[targetIndex];
  }

  /**
   * Update Status (Admin Console)
   */
  public async updateStatus(
    id: string,
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'No-show'
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await this.getAllReservations();
        return true;
      }
    } catch (error) {
      console.warn('Failed backend status update, applying locally:', error);
    }

    const target = this.localReservations.find((r) => r.id === id);
    if (!target) return false;

    target.status = status;
    this.saveLocalFallback();
    return true;
  }
}

export const reservationService = new ReservationService();
