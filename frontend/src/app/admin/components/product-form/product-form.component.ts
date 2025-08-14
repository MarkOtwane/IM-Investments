import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, CreateProductDto, Product } from '../../../core/models/product.model';
import { CategoriesService } from '../../../core/services/categories.service';
import { ProductService } from '../../../core/services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class ProductFormComponent implements OnInit {
  product: CreateProductDto = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stock: 0,
    categoryId: 1,
  };

  categories: Category[] = [];
  isEdit = false;
  productId: number | null = null;
  error: string | null = null;
  successMessage: string | null = null;
  loading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    const idParam = this.route.snapshot.paramMap.get('id');
    this.productId = idParam ? +idParam : null;

    if (this.productId) {
      this.isEdit = true;
      this.loadProductForEdit();
    }
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categories loaded:', categories);
        if (categories.length > 0 && !this.isEdit) {
          this.product.categoryId = categories[0].id;
        }
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.error = 'Failed to load categories';
      },
    });
  }

  loadProductForEdit(): void {
    if (!this.productId) return;
    
    this.loading = true;
    this.productService.getProductById(this.productId.toString()).subscribe({
      next: (product) => {
        this.product = {
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          categoryId: product.categoryId,
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load product', err);
        this.error = 'Failed to load product for editing';
        this.loading = false;
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        this.error = 'Please select a valid image file (JPEG, PNG, or GIF)';
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.error = 'File size must be less than 10MB';
        return;
      }

      this.selectedFile = file;
      this.error = null;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    if (!this.isEdit) {
      this.product.imageUrl = '';
    }
  }

  isFormValid(): boolean {
    return !!(
      this.product.name &&
      this.product.description &&
      this.product.price > 0 &&
      this.product.stock >= 0 &&
      this.product.categoryId
    );
  }

  onSubmit(): void {
    console.log('Form submitted');
    this.error = null;
    this.successMessage = null;

    if (!this.isFormValid()) {
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;

    if (this.isEdit && this.productId !== null) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  private createProduct(): void {
    console.log('Creating product:', this.product);
    console.log('Selected file:', this.selectedFile);

    if (this.selectedFile) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('description', this.product.description);
      formData.append('price', this.product.price.toString());
      formData.append('stock', this.product.stock.toString());
      formData.append('categoryId', this.product.categoryId.toString());
      formData.append('image', this.selectedFile);

      console.log('Sending FormData to backend');
      this.productService.createProductWithImage(formData).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.loading = false;
          this.successMessage = 'Product created successfully!';
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1500);
        },
        error: (err: any) => {
          console.error('Failed to create product:', err);
          this.loading = false;
          this.error = err.error?.message || 'Failed to create product. Please try again.';
        },
      });
    } else {
      // Use JSON for no file upload
      console.log('Sending JSON to backend');
      this.productService.createProduct(this.product).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.loading = false;
          this.successMessage = 'Product created successfully!';
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1500);
        },
        error: (err: any) => {
          console.error('Failed to create product:', err);
          this.loading = false;
          this.error = err.error?.message || 'Failed to create product. Please try again.';
        },
      });
    }
  }

  private updateProduct(): void {
    if (!this.productId) return;

    console.log('Updating product:', this.productId, this.product);

    if (this.selectedFile) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('description', this.product.description);
      formData.append('price', this.product.price.toString());
      formData.append('stock', this.product.stock.toString());
      formData.append('categoryId', this.product.categoryId.toString());
      formData.append('image', this.selectedFile);

      this.productService.updateProductWithImage(this.productId.toString(), formData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.loading = false;
          this.successMessage = 'Product updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1500);
        },
        error: (err: any) => {
          console.error('Failed to update product:', err);
          this.loading = false;
          this.error = err.error?.message || 'Failed to update product. Please try again.';
        },
      });
    } else {
      // Use JSON for no file upload
      const updatedProduct: Product = {
        ...this.product,
        id: this.productId,
        createdAt: new Date().toISOString(),
        category: this.categories.find(c => c.id === this.product.categoryId) || { id: 0, name: '' },
      };

      this.productService.updateProduct(this.productId.toString(), updatedProduct).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.loading = false;
          this.successMessage = 'Product updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1500);
        },
        error: (err: any) => {
          console.error('Failed to update product:', err);
          this.loading = false;
          this.error = err.error?.message || 'Failed to update product. Please try again.';
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}