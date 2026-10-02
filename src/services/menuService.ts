import { MenuItem, menuData as INITIAL_MENU_DATA } from '../data/menuData';

const STORAGE_KEY = 'ember_menu_cms_data';

class MenuService {
  private menuItems: MenuItem[] = [];

  constructor() {
    this.loadMenu();
  }

  private loadMenu() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.menuItems = JSON.parse(data);
      } else {
        this.menuItems = INITIAL_MENU_DATA;
        this.saveMenu();
      }
    } catch {
      this.menuItems = INITIAL_MENU_DATA;
    }
  }

  private saveMenu() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.menuItems));
    } catch {
      // ignore
    }
  }

  public getMenu(): MenuItem[] {
    return [...this.menuItems];
  }

  public getDish(id: string): MenuItem | undefined {
    return this.menuItems.find((d) => d.id === id);
  }

  public addDish(dish: Omit<MenuItem, 'id'>): MenuItem {
    const newDish: MenuItem = {
      ...dish,
      id: 'm_' + Date.now(),
    };
    this.menuItems.unshift(newDish);
    this.saveMenu();
    return newDish;
  }

  public updateDish(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const index = this.menuItems.findIndex((d) => d.id === id);
    if (index === -1) return null;

    this.menuItems[index] = {
      ...this.menuItems[index],
      ...updates,
    };
    this.saveMenu();
    return this.menuItems[index];
  }

  public deleteDish(id: string): boolean {
    const prevLength = this.menuItems.length;
    this.menuItems = this.menuItems.filter((d) => d.id !== id);
    this.saveMenu();
    return this.menuItems.length < prevLength;
  }

  public resetToDefault() {
    this.menuItems = INITIAL_MENU_DATA;
    this.saveMenu();
  }
}

export const menuService = new MenuService();
