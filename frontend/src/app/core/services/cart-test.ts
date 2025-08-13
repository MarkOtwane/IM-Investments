import { CartService } from './cart.service';
import { firstValueFrom } from 'rxjs';

async function testGetCart() {
  const cartService = new CartService(/* HttpClient instance needed here */);
  try {
    const cart = await firstValueFrom(cartService.getCart());
    console.log('Current cart contents:', cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
  }
}

testGetCart();
