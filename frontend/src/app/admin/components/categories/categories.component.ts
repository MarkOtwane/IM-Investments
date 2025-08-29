import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../core/models/product.model';
import { CategoriesService } from '../../../core/services/categories.service';
import { AdminSidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroment';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-admin-sidebar></app-admin-sidebar>
      
      <div class="flex-1 ml-64">
        <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h1 class="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p class="text-gray-600 text-sm">Organize your products into categories</p>
        </div>
        
        <div class="p-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Product Categories</h2>
              <div class="flex items-center space-x-2">
                <input [(ngModel)]="newCategory" placeholder="New category name" class="border rounded px-3 py-2 text-sm" />
                <button (click)="addCategory()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Category
                </button>
              </div>
            </div>
            
            <div *ngIf="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Loading categories...</p>
            </div>
            
            <div *ngIf="!loading && categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div *ngFor="let category of categories" 
                   class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 class="font-semibold text-gray-900">{{ category.name }}</h3>
                <div class="mt-2 flex space-x-2">
                  <button class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  <button class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </div>
              </div>
            </div>
            
            <div *ngIf="!loading && categories.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by creating your first category.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  newCategory = '';

  constructor(private categoriesService: CategoriesService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.loading = false;
      }
    });
  }

  addCategory(): void {
    const name = this.newCategory.trim();
    if (!name) return;
    this.http.post<Category>(`${environment.apiUrl}/categories`, { name }).subscribe({
      next: (cat) => {
        this.categories = [cat, ...this.categories].sort((a, b) => a.name.localeCompare(b.name));
        this.newCategory = '';
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to add category');
      }
    });
  }
}