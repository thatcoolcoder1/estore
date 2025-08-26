import axios from "axios";
import fs from "fs";
import dotenv from "dotenv"
dotenv.config()
// const API_KEY = process.env.Pexels_api;

// 🔑 put your real Pexels key here
const pexels = axios.create({
  baseURL: "https://api.pexels.com/v1/",
  headers: { Authorization: process.env.Pexels_api },
});

// 10 categories × 30 products each
const categories = {
  apparel: [
    "Leather Jacket", "Cotton T-Shirt", "Denim Jeans", "Wool Sweater", "Summer Dress",
    "Hoodie", "Sneakers", "Formal Suit", "Baseball Cap", "Winter Coat",
    "Tank Top", "Chinos", "Scarf", "Beanie Hat", "Rain Jacket",
    "Sports Jersey", "Cargo Pants", "Tracksuit", "Blazer", "Polo Shirt",
    "Maxi Dress", "Cardigan", "Flip Flops", "Leather Boots", "Swimwear",
    "Overalls", "Kurta", "Sherwani", "Saree", "Traditional Lehenga"
  ],
  electronics: [
    "Laptop", "Smartphone", "Bluetooth Speaker", "Smartwatch", "Wireless Earbuds",
    "Tablet", "DSLR Camera", "Gaming Console", "Drone", "VR Headset",
    "External Hard Drive", "Smart TV", "E-Reader", "Portable Charger", "Graphics Card",
    "Mechanical Keyboard", "Wireless Mouse", "Monitor", "Fitness Tracker", "Microwave Oven",
    "Electric Kettle", "Router", "Printer", "Projector", "Digital Clock",
    "Hair Dryer", "Trimmer", "Power Bank", "Dash Cam", "Action Camera"
  ],
  home: [
    "Ceramic Mug", "Floor Lamp", "Sofa Set", "Kitchen Knife", "Cutting Board",
    "Wall Clock", "Rug", "Curtains", "Cushion", "Vase",
    "Plant Pot", "Dining Set", "Ceiling Fan", "Air Purifier", "Vacuum Cleaner",
    "Mixer Grinder", "Microwave", "Refrigerator", "Bedside Table", "Desk Lamp",
    "Bookshelf", "Photo Frame", "Wall Art", "Laundry Basket", "Scented Candle",
    "Doormat", "Mirror", "Toaster", "Rice Cooker", "Induction Stove"
  ],
  beauty: [
    "Lipstick", "Perfume Bottle", "Face Cream", "Makeup Kit", "Eyeliner",
    "Mascara", "Nail Polish", "Foundation", "Compact Powder", "Blush",
    "Hair Serum", "Shampoo", "Conditioner", "Body Lotion", "Hand Cream",
    "Face Wash", "Sunscreen", "Beard Oil", "Aftershave", "Face Mask",
    "Essential Oils", "Makeup Brushes", "Beauty Blender", "Lip Balm", "Toner",
    "Face Scrub", "Body Butter", "Hair Brush", "Cleansing Wipes", "Nail File"
  ],
  sports: [
    "Football", "Tennis Racket", "Yoga Mat", "Basketball Shoes", "Cricket Bat",
    "Hockey Stick", "Baseball Glove", "Table Tennis Paddle", "Shuttlecock", "Boxing Gloves",
    "Running Shoes", "Skipping Rope", "Dumbbells", "Resistance Bands", "Gym Bag",
    "Swim Goggles", "Bicycle Helmet", "Skateboard", "Roller Skates", "Surfboard",
    "Badminton Racket", "Golf Club", "Fishing Rod", "Karate Belt", "Wrestling Shoes",
    "Hiking Shoes", "Climbing Rope", "Kayak", "Rowing Oars", "Water Polo Ball"
  ],
  outdoor: [
    "Camping Tent", "Hiking Backpack", "Sleeping Bag", "Water Bottle", "Lantern",
    "Camping Stove", "Hammock", "Compass", "Pocket Knife", "Trekking Poles",
    "First Aid Kit", "Flashlight", "Camping Chair", "Portable Grill", "Rain Poncho",
    "Binoculars", "Map", "Insect Repellent", "Picnic Blanket", "Fire Starter",
    "Hiking Boots", "Camping Table", "Cooler Box", "Folding Knife", "Solar Charger",
    "Climbing Harness", "Headlamp", "Travel Pillow", "Outdoor Hat", "Portable Fan"
  ],
  furniture: [
    "Dining Table", "Office Chair", "Bookshelf", "Bed Frame", "Coffee Table",
    "TV Stand", "Wardrobe", "Shoe Rack", "Side Table", "Recliner Sofa",
    "Rocking Chair", "Bar Stool", "Dressing Table", "Study Desk", "Chest of Drawers",
    "Cabinet", "Mirror Wardrobe", "Corner Shelf", "Wall Shelf", "Futon",
    "Bunk Bed", "Loveseat", "Armchair", "Kitchen Island", "Storage Bench",
    "Console Table", "Nightstand", "Pantry Shelf", "Glass Table", "Bean Bag"
  ],
  toys: [
    "Teddy Bear", "Lego Set", "Toy Car", "Dollhouse", "Rubik's Cube",
    "Remote Control Car", "Action Figure", "Board Game", "Puzzle", "Toy Train",
    "Building Blocks", "Yo-Yo", "Toy Robot", "Dinosaur Toy", "Stuffed Bunny",
    "Water Gun", "Marbles", "Slinky", "Kite", "Play Dough",
    "Barbie Doll", "Spinning Top", "Nerf Gun", "Toy Drum", "Toy Guitar",
    "Toy Kitchen", "RC Helicopter", "Bubble Maker", "Race Track", "Toy Sword"
  ],
  books: [
    "Fantasy Novel", "Cookbook", "Science Textbook", "Children's Story", "Romance Novel",
    "Mystery Thriller", "Horror Book", "Comic Book", "Biography", "History Book",
    "Self Help Book", "Business Guide", "Poetry Collection", "Travel Book", "Art Book",
    "Photography Book", "Encyclopedia", "Language Learning Book", "Technology Guide", "Programming Book",
    "Philosophy Book", "Religion Book", "Health & Fitness Book", "Math Workbook", "SAT Prep Book",
    "Atlas", "Fairy Tales", "Classic Literature", "Short Stories", "Graphic Novel"
  ],
  groceries: [
    "Organic Apple", "Coffee Beans", "Bread Loaf", "Milk Carton", "Bananas",
    "Orange Juice", "Rice Bag", "Wheat Flour", "Olive Oil", "Butter",
    "Cheese", "Eggs", "Potatoes", "Tomatoes", "Onions",
    "Chicken Breast", "Fish Fillet", "Yogurt", "Cereal Box", "Tea Pack",
    "Honey Jar", "Jam Bottle", "Pasta Pack", "Salt", "Sugar",
    "Green Tea", "Chocolates", "Biscuits", "Spices", "Lentils"
  ],
};

async function getImage(query) {
  try {
    const res = await pexels.get("search", { params: { query, per_page: 1 } });
    if (res.data.photos.length > 0) {
      return res.data.photos[0].src.medium;
    }
    return "https://via.placeholder.com/600";
  } catch (err) {
    console.error("Error fetching image for:", query, err.message);
    return "https://via.placeholder.com/600";
  }
}

async function generateProducts() {
  let products = [];
  let id = 1;

  for (const [category, items] of Object.entries(categories)) {
    for (const title of items) {
      const image = await getImage(title);
      const product = {
        id: id++,
        title,
        description: `High quality ${title} from our ${category} collection.`,
        image: [image],
        price: Math.floor(Math.random() * 5000) + 500,
        category,
        countInStock: Math.floor(Math.random() * 100),
      };
      // console.log("working")
      products.push(product);
    }
  }

  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));
  console.log("✅ products.json created with", products.length, "items");
}

generateProducts();
