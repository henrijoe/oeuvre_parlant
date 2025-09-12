import { IProduct } from './../../../lib/redux/productsSlice';
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs-extra';
import path from 'path';

const prisma = new PrismaClient();

// Helper function pour gérer les erreurs de manière type-safe
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

/**
 * GET - Récupère la liste des produits
 * @param request - La requête contenant les paramètres de pagination
 * @returns Liste des produits avec pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    console.log('🔍 Fetching products from database...');
    
    // Compter le nombre total de produits
    const totalProducts = await prisma.product.count();
    
    // Récupérer les produits avec pagination
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ Found ${products.length} products out of ${totalProducts}`);
    
    const totalPages = Math.ceil(totalProducts / limit);
    
    const productsWithImage = products.map((product:IProduct) => ({
      ...product,
      image: product.imagePath || '/images/default-image.jpg'
    }));
    
    // Retourner avec pagination
    return NextResponse.json({
      products: productsWithImage,
      totalPages,
      currentPage: page,
      totalProducts
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

/**
 * POST - Crée un nouveau produit avec image
 * @param request - Request contenant les données du produit et le fichier image
 * @returns Le produit créé
 */
export async function POST(request: NextRequest) {
  try {
    console.log('✅ Début de l\'upload...');
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const name = formData.get('name') as string | null;
    const priceStr = formData.get('price') as string | null;
    const author = formData.get('author') as string | null;
    const location = formData.get('location') as string | null;
    const whatsapp = formData.get('whatsapp') as string | null;
    const category = formData.get('category') as string | null;
    const description = formData.get('description') as string | null;

    console.log('📁 Fichier reçu:', file ? file.name : 'Aucun fichier');
    console.log('📝 Nom produit:', name);

    // Validation des champs requis
    if (!file || !name || !priceStr) {
      console.log('❌ Champs manquants');
      return NextResponse.json(
        { error: 'Name, price and image are required' },
        { status: 400 }
      );
    }

    const price = parseFloat(priceStr);
    if (isNaN(price)) {
      return NextResponse.json(
        { error: 'Price must be a valid number' },
        { status: 400 }
      );
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.ensureDir(uploadsDir);

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Enregistrer dans la base de données
    const product = await prisma.product.create({
      data: {
        uuid: timestamp.toString(),
        name,
        price,
        oldPrice: price * 1.2, // 20% de plus que le prix actuel
        author: author || "Artiste inconnu",
        location: location || "Non spécifié",
        whatsapp: whatsapp || "",
        category: category || 'Art & Craft',
        description: description || "",
        imagePath: `/uploads/${fileName}`
      }
    });

    console.log('✅ Product created successfully:', product.id);

    // Retourner le produit avec le champ image
    return NextResponse.json({
      ...product,
      image: product.imagePath
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT - Met à jour un produit existant
 * @param request - Request contenant les données à mettre à jour
 * @returns Le produit mis à jour
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const name = formData.get('name') as string | null;
    const priceStr = formData.get('price') as string | null;
    const author = formData.get('author') as string | null;
    const location = formData.get('location') as string | null;
    const whatsapp = formData.get('whatsapp') as string | null;
    const category = formData.get('category') as string | null;
    const description = formData.get('description') as string | null;

    // Vérifier si le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let imagePath = existingProduct.imagePath;

    // Gérer l'upload de la nouvelle image si fournie
    if (file) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.ensureDir(uploadsDir);

      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `${timestamp}.${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      imagePath = `/uploads/${fileName}`;

      // Supprimer l'ancienne image si elle existe
      if (existingProduct.imagePath && existingProduct.imagePath !== '/images/default-image.jpg') {
        const oldImagePath = path.join(process.cwd(), 'public', existingProduct.imagePath);
        if (await fs.pathExists(oldImagePath)) {
          await fs.remove(oldImagePath);
        }
      }
    }

    const price = priceStr ? parseFloat(priceStr) : existingProduct.price;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        price,
        oldPrice: price * 1.2,
        author: author || existingProduct.author,
        location: location || existingProduct.location,
        whatsapp: whatsapp || existingProduct.whatsapp,
        category: category || existingProduct.category,
        description: description || existingProduct.description,
        imagePath
      }
    });

    return NextResponse.json({
      ...updatedProduct,
      image: updatedProduct.imagePath
    });

  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprime un produit
 * @param request - Request contenant l'ID du produit à supprimer
 * @returns Confirmation de suppression
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Vérifier si le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Supprimer l'image associée si elle existe
    if (existingProduct.imagePath && existingProduct.imagePath !== '/images/default-image.jpg') {
      const imagePath = path.join(process.cwd(), 'public', existingProduct.imagePath);
      if (await fs.pathExists(imagePath)) {
        await fs.remove(imagePath);
      }
    }

    // Supprimer le produit de la base de données
    await prisma.product.delete({
      where: { id }
    });

    console.log('✅ Product deleted successfully:', id);

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}