// app/edit-product/[id]/page.tsx
"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { IProduct } from "@/lib/redux/productsSlice";
import Wrapper from "@/components/wrapper";
import Switcher from "@/components/switcher";
import Link from "next/link";
import Image from "next/image";
import * as Icon from 'react-feather';
import { useAlert } from "@/components/useAlert";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);
    const products = useSelector((state: RootState) => state.products.productData);
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Utilisation du hook useAlert
    const { showAlert } = useAlert();


    // États du formulaire
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        author: '',
        location: '',
        whatsapp: '',
        category: '',
        description: ''
    });
    const [imagePreview, setImagePreview] = useState<string>('');
    const [newImage, setNewImage] = useState<File | null>(null);

    // Charger le produit
    useEffect(() => {
        if (products && Array.isArray(products)) {
            const foundProduct = products.find((p) => p.id === productId);
            if (foundProduct) {
                setProduct(foundProduct);
                setFormData({
                    name: foundProduct.name || '',
                    price: foundProduct.price?.toString() || '',
                    author: foundProduct.author || '',
                    location: foundProduct.location || '',
                    whatsapp: foundProduct.whatsapp || '',
                    category: foundProduct.category || '',
                    description: foundProduct.description || ''
                });
                setImagePreview(foundProduct.image || '');
            }
            setLoading(false);
        }
    }, [products, productId]);

    // Gestionnaire de changement des champs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Gestionnaire de changement d'image
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formDataToSend = new FormData();

            // Ajouter les champs texte
            formDataToSend.append('name', formData?.name);
            formDataToSend.append('price', formData?.price);
            formDataToSend.append('author', formData?.author);
            formDataToSend.append('location', formData?.location);
            formDataToSend.append('whatsapp', formData?.whatsapp);
            formDataToSend.append('category', formData?.category);
            formDataToSend.append('description', formData?.description);

            // Ajouter la nouvelle image si elle existe
            if (newImage) {
                formDataToSend.append('image', newImage);
            }

            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (response.ok) {
                // alert('✅ Œuvre modifiée avec succès !');
                showAlert('success', 'Œuvre ajoutée avec succès !');
                router.push('/');
            } else {
                throw new Error('Erreur lors de la modification');
            }
        } catch (error: any) {
            console.error('Erreur:', error);
            showAlert('danger', error.message || 'Une erreur est survenue lors de l\'ajout');
        } finally {
            setSaving(false);
        }
    };


    // if (loading) {
    //     return (
    //         <Wrapper>
    //             <div className="container-fluid relative px-3">
    //                 <div className="layout-specing">
    //                     <div className="text-center py-20">
    //                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    //                         <p className="mt-4 text-lg">Chargement...</p>
    //                     </div>
    //                 </div>
    //             </div>
    //         </Wrapper>
    //     );
    // }

    if (!product) {
        return (
            <Wrapper>
                <div className="container-fluid relative px-3">
                    <div className="layout-specing">
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold text-red-600">Œuvre non trouvée</h2>
                            <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
                                ← Retour à la liste
                            </Link>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    {/* En-tête */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Modifier l'œuvre</h1>
                        <Link
                            href="/"
                            className="flex items-center text-indigo-600 hover:text-indigo-700"
                        >
                            <Icon.ArrowLeft className="mr-2" size={16} />
                            Retour aux œuvres
                        </Link>
                    </div>

                    {/* Formulaire */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-gray-700 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Section Image */}
                            <div>
                                <label className="block text-lg font-semibold mb-4">Image de l'œuvre</label>
                                <div className="flex flex-col items-center space-y-4">
                                    {imagePreview && (
                                        <div className="relative w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg">
                                            <Image
                                                src={imagePreview}
                                                alt="Aperçu"
                                                fill
                                                className="object-contain rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <label className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                                        <Icon.Upload className="inline mr-2" size={18} />
                                        Changer l'image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-sm text-gray-500">Formats supportés: JPG, PNG, WEBP. Max: 10MB</p>
                                </div>
                            </div>

                            {/* Informations de base */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold mb-2">Nom de l'œuvre *</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-2">Prix (FCFA) *</label>
                                    <input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Informations secondaires */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold mb-2">Auteur</label>
                                    <input
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-2">Localisation</label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Contact et Catégorie */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold mb-2">Contact WhatsApp</label>
                                    <input
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-2">Catégorie</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="">Sélectionnez une catégorie</option>
                                        <option value="Art & Craft">Art & Craft</option>
                                        <option value="Peinture">Peinture</option>
                                        <option value="Sculpture">Sculpture</option>
                                        <option value="Photographie">Photographie</option>
                                        <option value="Digital Art">Digital Art</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-semibold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    placeholder="Décrivez votre œuvre en détail..."
                                />
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-lg transition"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <Icon.Save className="mr-2" size={18} />
                                            Enregistrer les modifications
                                        </>
                                    )}
                                </button>

                                <Link
                                    href="/"
                                    className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition"
                                >
                                    <Icon.X className="mr-2" size={18} />
                                    Annuler
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Switcher />
        </Wrapper>
    );
}