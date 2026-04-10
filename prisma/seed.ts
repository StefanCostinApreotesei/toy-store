import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash(process.env.ADMIN_PASSWORD || "Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@jucariistore.ro" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@jucariistore.ro",
      hashedPassword: adminPassword,
      name: "Administrator",
      role: "ADMIN",
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // Create categories
  const catCopii = await prisma.category.upsert({
    where: { slug: "jucarii-copii" },
    update: {},
    create: {
      name: "Jucării pentru copii",
      slug: "jucarii-copii",
      description: "Jucării educaționale și creative pentru copii de toate vârstele",
      displayOrder: 1,
    },
  });

  const catAnimale = await prisma.category.upsert({
    where: { slug: "jucarii-animale" },
    update: {},
    create: {
      name: "Jucării pentru animale",
      slug: "jucarii-animale",
      description: "Jucării distractive și stimulante pentru animalele tale de companie",
      displayOrder: 2,
    },
  });

  // Create subcategories
  const subEducationale = await prisma.subcategory.upsert({
    where: { slug: "educationale" },
    update: {},
    create: {
      name: "Jucării educaționale",
      slug: "educationale",
      description: "Jucării care stimulează învățarea și creativitatea",
      categoryId: catCopii.id,
      displayOrder: 1,
    },
  });

  const subLego = await prisma.subcategory.upsert({
    where: { slug: "lego" },
    update: {},
    create: {
      name: "Jucării LEGO",
      slug: "lego",
      description: "Seturi LEGO pentru constructori de toate vârstele",
      categoryId: catCopii.id,
      displayOrder: 2,
    },
  });

  const subCaini = await prisma.subcategory.upsert({
    where: { slug: "caini" },
    update: {},
    create: {
      name: "Jucării pentru câini",
      slug: "caini",
      description: "Jucării rezistente și distractive pentru câini",
      categoryId: catAnimale.id,
      displayOrder: 1,
    },
  });

  const subPisici = await prisma.subcategory.upsert({
    where: { slug: "pisici" },
    update: {},
    create: {
      name: "Jucării pentru pisici",
      slug: "pisici",
      description: "Jucării interactive pentru pisici curioase",
      categoryId: catAnimale.id,
      displayOrder: 2,
    },
  });

  const subHamsteri = await prisma.subcategory.upsert({
    where: { slug: "hamsteri" },
    update: {},
    create: {
      name: "Jucării pentru hamsteri",
      slug: "hamsteri",
      description: "Accesorii și jucării pentru hamsteri fericiți",
      categoryId: catAnimale.id,
      displayOrder: 3,
    },
  });

  console.log("Categories and subcategories created.");

  // Create products
  const products = [
    // Educational toys
    {
      name: "Set Puzzle Educativ Alfabet",
      slug: "set-puzzle-educativ-alfabet",
      description: "<p>Set complet de puzzle educativ cu literele alfabetului. Fiecare piesă este colorată și rezistentă, perfectă pentru copiii care învață literele. Include 26 de piese mari, ușor de manipulat de mâinile mici.</p><p>Material: lemn natural vopsit cu vopsele non-toxice.</p>",
      shortDescription: "Puzzle din lemn cu 26 de litere colorate",
      price: 49.99,
      oldPrice: 69.99,
      sku: "EDU-001",
      stock: 25,
      featured: true,
      recommendedAge: "3-6 ani",
      specifications: JSON.stringify([
        { key: "Material", value: "Lemn natural" },
        { key: "Număr piese", value: "26" },
        { key: "Dimensiuni cutie", value: "30x25x5 cm" },
        { key: "Greutate", value: "450g" },
      ]),
      subcategoryId: subEducationale.id,
    },
    {
      name: "Joc de Memorie cu Animale",
      slug: "joc-memorie-animale",
      description: "<p>Joc de memorie cu 32 de cartonașe ilustrate cu animale adorabile. Dezvoltă memoria vizuală și concentrarea copilului. Cartonașele sunt din carton gros, plastifiat, rezistent la uzură.</p>",
      shortDescription: "32 cartonașe cu animale pentru antrenament memoriei",
      price: 34.99,
      sku: "EDU-002",
      stock: 40,
      featured: false,
      recommendedAge: "4-8 ani",
      specifications: JSON.stringify([
        { key: "Număr cartonașe", value: "32 (16 perechi)" },
        { key: "Material", value: "Carton plastifiat" },
        { key: "Dimensiuni cartonaș", value: "7x7 cm" },
      ]),
      subcategoryId: subEducationale.id,
    },
    {
      name: "Tablă Magnetică Educativă",
      slug: "tabla-magnetica-educativa",
      description: "<p>Tablă magnetică dublă - o parte pentru cretă, o parte pentru markere. Include set de litere și cifre magnetice, markere colorate și cretă. Cadru din lemn robust cu suport reglabil.</p>",
      shortDescription: "Tablă 2-în-1 cu litere și cifre magnetice",
      price: 89.99,
      oldPrice: 119.99,
      sku: "EDU-003",
      stock: 15,
      featured: true,
      recommendedAge: "3-8 ani",
      specifications: JSON.stringify([
        { key: "Dimensiuni", value: "60x45 cm" },
        { key: "Material cadru", value: "Lemn" },
        { key: "Include", value: "Litere, cifre, markere, cretă" },
        { key: "Fețe", value: "2 (cretă + marker)" },
      ]),
      subcategoryId: subEducationale.id,
    },
    // LEGO toys
    {
      name: "LEGO City Stația de Pompieri",
      slug: "lego-city-statia-pompieri",
      description: "<p>Set LEGO City cu stația de pompieri completă. Include mașina de pompieri cu scară extensibilă, elicopter, 4 minifigurine pompieri și accesorii. Stația are 3 nivele cu garaj, cameră de comandă și dormitor.</p>",
      shortDescription: "Stație de pompieri cu vehicule și 4 minifigurine",
      price: 249.99,
      oldPrice: 299.99,
      sku: "LEGO-001",
      stock: 10,
      featured: true,
      recommendedAge: "6-12 ani",
      specifications: JSON.stringify([
        { key: "Număr piese", value: "509" },
        { key: "Minifigurine", value: "4" },
        { key: "Vehicule", value: "Mașină pompieri + Elicopter" },
        { key: "Dimensiuni stație", value: "35x25x30 cm" },
      ]),
      subcategoryId: subLego.id,
    },
    {
      name: "LEGO Technic Excavator",
      slug: "lego-technic-excavator",
      description: "<p>Excavator LEGO Technic cu funcții mecanice reale. Brațul excavatorului se mișcă, cupa se rotește, și șenilele funcționează. Model 2-în-1 care poate fi reconstruit ca încărcător frontal.</p>",
      shortDescription: "Excavator mecanic 2-în-1 cu funcții reale",
      price: 189.99,
      sku: "LEGO-002",
      stock: 18,
      featured: false,
      recommendedAge: "8-14 ani",
      specifications: JSON.stringify([
        { key: "Număr piese", value: "569" },
        { key: "Model", value: "2-în-1" },
        { key: "Funcții", value: "Braț mobil, cupă rotativă, șenile" },
        { key: "Dimensiuni", value: "28x12x17 cm" },
      ]),
      subcategoryId: subLego.id,
    },
    {
      name: "LEGO Friends Cafeneaua din Parc",
      slug: "lego-friends-cafeneaua-parc",
      description: "<p>Cafenea LEGO Friends cu terasă, meniu și accesorii complete. Include 3 minifigurine, bicicletă, și un câine. Terasă cu umbrele și mese, interior cu tejghea și mașină de cafea.</p>",
      shortDescription: "Cafenea cu terasă, 3 minifigurine și accesorii",
      price: 129.99,
      oldPrice: 159.99,
      sku: "LEGO-003",
      stock: 22,
      featured: true,
      recommendedAge: "6-10 ani",
      specifications: JSON.stringify([
        { key: "Număr piese", value: "346" },
        { key: "Minifigurine", value: "3" },
        { key: "Accesorii", value: "Bicicletă, câine, meniu" },
      ]),
      subcategoryId: subLego.id,
    },
    // Dog toys
    {
      name: "Minge Rezistentă pentru Câini",
      slug: "minge-rezistenta-caini",
      description: "<p>Minge super-rezistentă din cauciuc natural, perfectă pentru câini energici. Nu se sparge și nu se deformează. Sare bine pe orice suprafață. Dimensiune medie, potrivită pentru câini de talie medie și mare.</p>",
      shortDescription: "Minge din cauciuc natural, indestructibilă",
      price: 29.99,
      sku: "DOG-001",
      stock: 50,
      featured: false,
      recommendedAge: null,
      specifications: JSON.stringify([
        { key: "Material", value: "Cauciuc natural" },
        { key: "Diametru", value: "7 cm" },
        { key: "Rezistență", value: "Foarte mare" },
        { key: "Potrivit pentru", value: "Câini medii și mari" },
      ]),
      subcategoryId: subCaini.id,
    },
    {
      name: "Frânghie Dentară Interactivă",
      slug: "franghie-dentara-interactiva",
      description: "<p>Jucărie din frânghie împletită cu noduri, perfectă pentru jocul de tragere și curățarea dinților. Fibrele naturale de bumbac masează gingiile și îndepărtează tartrul. Disponibilă în mai multe culori.</p>",
      shortDescription: "Frânghie cu noduri pentru joc și igienă dentară",
      price: 19.99,
      oldPrice: 24.99,
      sku: "DOG-002",
      stock: 60,
      featured: true,
      specifications: JSON.stringify([
        { key: "Material", value: "Bumbac natural" },
        { key: "Lungime", value: "35 cm" },
        { key: "Beneficii", value: "Curățare dinți, masaj gingii" },
      ]),
      subcategoryId: subCaini.id,
    },
    // Cat toys
    {
      name: "Undița Interactivă cu Pene",
      slug: "undita-interactiva-pene",
      description: "<p>Jucărie tip undiță cu pene colorate și clopoțel. Stimulează instinctul de vânătoare al pisicii. Bățul flexibil din fibră de sticlă asigură mișcări naturale. Penele sunt atașate cu elastic rezistent.</p>",
      shortDescription: "Undiță cu pene și clopoțel pentru pisici active",
      price: 24.99,
      sku: "CAT-001",
      stock: 35,
      featured: false,
      specifications: JSON.stringify([
        { key: "Lungime băț", value: "40 cm" },
        { key: "Lungime totală", value: "80 cm cu elastic" },
        { key: "Material", value: "Fibră de sticlă, pene naturale" },
      ]),
      subcategoryId: subPisici.id,
    },
    {
      name: "Tunel de Joacă Pliabil",
      slug: "tunel-joaca-pliabil-pisici",
      description: "<p>Tunel de joacă pliabil cu 3 intrări și fereastră de observație. Se pliază complet pentru depozitare ușoară. Interior cu material care produce sunet la atingere, stimulând curiozitatea pisicii.</p>",
      shortDescription: "Tunel pliabil cu 3 intrări pentru pisici curioase",
      price: 44.99,
      oldPrice: 59.99,
      sku: "CAT-002",
      stock: 20,
      featured: true,
      specifications: JSON.stringify([
        { key: "Lungime", value: "120 cm" },
        { key: "Diametru", value: "25 cm" },
        { key: "Intrări", value: "3" },
        { key: "Material", value: "Poliester rezistent" },
      ]),
      subcategoryId: subPisici.id,
    },
    // Hamster toys
    {
      name: "Roată de Exerciții Silențioasă",
      slug: "roata-exercitii-silentioasa-hamster",
      description: "<p>Roată de exerciții din plastic de calitate, cu sistem de rulmenți silențios. Design ergonomic cu suprafață antiderapantă. Perfectă pentru utilizare nocturnă fără zgomot. Se montează ușor pe cusca standard.</p>",
      shortDescription: "Roată silențioasă cu rulmenți pentru hamsteri",
      price: 34.99,
      sku: "HAM-001",
      stock: 30,
      featured: false,
      specifications: JSON.stringify([
        { key: "Diametru", value: "20 cm" },
        { key: "Material", value: "Plastic ABS" },
        { key: "Nivel zgomot", value: "Silențios (rulmenți)" },
        { key: "Montare", value: "Suport cusca standard" },
      ]),
      subcategoryId: subHamsteri.id,
    },
    {
      name: "Set Tuburi și Tuneluri Hamster",
      slug: "set-tuburi-tuneluri-hamster",
      description: "<p>Set modular de tuburi și tuneluri transparente pentru hamsteri. Include 8 secțiuni drepte, 4 coturi și 2 conectori în T. Se poate extinde cu seturi adiționale. Tunelurile transparente permit observarea hamsterului în timp ce explorează.</p>",
      shortDescription: "Set modular 14 piese, extensibil",
      price: 54.99,
      oldPrice: 69.99,
      sku: "HAM-002",
      stock: 25,
      featured: true,
      specifications: JSON.stringify([
        { key: "Piese incluse", value: "14 (8 drepte, 4 coturi, 2 T)" },
        { key: "Material", value: "Plastic transparent" },
        { key: "Diametru tub", value: "5 cm" },
        { key: "Extensibil", value: "Da" },
      ]),
      subcategoryId: subHamsteri.id,
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    createdProducts.push(created);

    // Create placeholder image for each product
    await prisma.productImage.create({
      data: {
        url: `/images/placeholders/${product.slug}.jpg`,
        alt: product.name,
        displayOrder: 0,
        productId: created.id,
      },
    });
  }

  console.log(`${createdProducts.length} products created.`);

  // Set up some recommendations
  // Educational toys recommend each other
  const eduProducts = createdProducts.filter((p) =>
    ["EDU-001", "EDU-002", "EDU-003"].includes(p.sku || "")
  );
  for (const product of eduProducts) {
    const others = eduProducts.filter((p) => p.id !== product.id);
    await prisma.product.update({
      where: { id: product.id },
      data: {
        recommendations: {
          connect: others.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  // LEGO products recommend each other
  const legoProducts = createdProducts.filter((p) =>
    ["LEGO-001", "LEGO-002", "LEGO-003"].includes(p.sku || "")
  );
  for (const product of legoProducts) {
    const others = legoProducts.filter((p) => p.id !== product.id);
    await prisma.product.update({
      where: { id: product.id },
      data: {
        recommendations: {
          connect: others.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  console.log("Recommendations set up.");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
