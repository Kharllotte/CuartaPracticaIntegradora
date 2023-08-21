import { fakerES as faker } from "@faker-js/faker";

const generateProducts = (n) => {
  const products = [];
  for (let i = 0; i < n; i++) products.push(generateProduct());
  return products;
};

const generateProduct = () => {
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.productMaterial(),
    price: faker.commerce.price(),
    stock: faker.number.int(),
  };
};

export default generateProducts;
