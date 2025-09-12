// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs-extra';
import path from 'path';

const prisma = new PrismaClient();

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const product = await prisma.product.findUnique({
//       where: { id: parseInt(params.id) }
//     });

//     if (!product) {
//       return NextResponse.json(
//         { error: 'Product not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(product);
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

export async function GET(
  // request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Ajouter Promise
) {
  try {
    const { id } = await params; // ← Attendre les params
    const productId = parseInt(id);
    
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



export async function PUT(
  request: NextRequest,
  // { params }: { params: { id: string } }
  context: { params: Promise<{ id: string }> } // ← Ajoutez Promise
) {
  try {
    const params = await context.params; // ← Await the params
    const productId = parseInt(params.id);
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const author = formData.get('author') as string;
    const location = formData.get('location') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    // Vérifier si le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let imagePath = existingProduct.imagePath;

    // Si une nouvelle image est fournie
    if (file && file.size > 0) {
      // Supprimer l'ancienne image
      if (existingProduct.imagePath) {
        const oldImagePath = path.join(process.cwd(), 'public', existingProduct.imagePath);
        if (fs.existsSync(oldImagePath)) {
          await fs.remove(oldImagePath);
        }
      }

      // Créer le dossier uploads s'il n'existe pas
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.ensureDir(uploadsDir);

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      // Convertir le fichier en buffer et l'écrire
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      imagePath = `/uploads/${fileName}`;
    }

    // Mettre à jour le produit
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        oldPrice: price * 1.2,
        author: author || "Artiste inconnu",
        location: location || "Non spécifié",
        whatsapp: whatsapp || "",
        category: category || 'Art & Craft',
        description: description || "",
        imagePath
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 
 * @param request 
 * @param param1 
 * @returns 
 */

export async function DELETE(
  // request: NextRequest,
  // { params }: { params: { id: string } }
    // context: { params: Promise<{ id: string }> } // ← Ajoutez Promise
  { params }: { params: Promise<{ id: string }> } // ← Ajouter Promise

) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    // Vérifier si le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Supprimer l'image associée
    if (existingProduct.imagePath) {
      const imagePath = path.join(process.cwd(), 'public', existingProduct.imagePath);
      if (fs.existsSync(imagePath)) {
        await fs.remove(imagePath);
      }
    }

    // Supprimer le produit de la base de données
    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}