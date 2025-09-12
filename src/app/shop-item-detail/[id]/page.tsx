"use client"
import Image from "next/image";
import Link from "next/link";
import ProductDetailTab from "@/components/product-detail-tab";
import Switcher from "@/components/switcher";
import Wrapper from "@/components/wrapper";
import { RootState } from "@/lib/redux/store";
import { useParams } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IProduct } from "@/lib/redux/productsSlice";


export default function Page() {


    const params = useParams();
    const productId = parseInt(params.id as string);
    const products = useSelector((state: RootState) => state.products.productData);
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);

    // Trouver le produit correspondant à l'ID
    // const art = products.find((p) => p.id === item);

    // Fonction pour obtenir l'URL de l'image en toute sécurité
    const getImageSrc = (product: IProduct | null) => {
        if (!product) return '/images/default-image.jpg';
        return product.imagePath || product.image || '/images/default-image.jpg';
    };

    // Trouver le produit correspondant à l'ID
    useEffect(() => {
        if (products && Array.isArray(products)) {
            const foundProduct = products.find((p) => p.id === productId);
            setProduct(foundProduct || null);
            setLoading(false);
        }
    }, [products, productId]);


    // Fonction pour générer des données basées sur le produit
    const getProductDetails = (product: IProduct) => {
        // Données par défaut basées sur la catégorie
        const baseDetails = {
            description: product.description || "",
            sizes: ["Unique"],
            colors: ["Sur mesure"],
            materials: ["Qualité artistique"],
            reviews: []
        };

        // Personnaliser selon la catégorie
        switch (product.category) {
            case "Peinture":
                return {
                    ...baseDetails,
                    materials: ["Toile", "Peinture à l'huile", "Cadre bois"],
                    colors: ["Personnalisable"]
                };
            case "Sculpture":
                return {
                    ...baseDetails,
                    materials: ["Bois", "Argile", "Bronze"],
                    sizes: ["Petit", "Moyen", "Grand"]
                };
            case "Photographie":
                return {
                    ...baseDetails,
                    materials: ["Papier photo premium", "Encadrement"],
                    sizes: ["20x30cm", "30x40cm", "40x60cm"]
                };
            default:
                return baseDetails;
        }
    };

    if (loading) {
        return (
            <Wrapper>
                <div className="container-fluid relative px-3">
                    <div className="layout-specing">
                        <div className="text-center py-10">
                            <h5 className="text-lg font-semibold">Chargement...</h5>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }

    if (!product) {
        return (
            <Wrapper>
                <div className="container-fluid relative px-3">
                    <div className="layout-specing">
                        <div className="text-center py-10">
                            <h5 className="text-lg font-semibold">Produit non trouvé</h5>
                            <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
                                Retour à la liste
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
                    {/* Fil d'Ariane */}
                    <div className="md:flex justify-between items-center">
                        <h5 className="text-lg font-semibold">{product.name}</h5>
                        <ul className="tracking-[0.5px] inline-flex items-center sm:mt-0 mt-3">
                            <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
                                <Link href="/">Accueil</Link>
                            </li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180">
                                <MdKeyboardArrowRight />
                            </li>
                            <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
                                <Link href="/">Œuvres</Link>
                            </li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180">
                                <MdKeyboardArrowRight />
                            </li>
                            <li className="inline-block capitalize text-[14px] font-bold text-indigo-600 dark:text-white">
                                {product.name}
                            </li>
                        </ul>
                    </div>

                    {/* Section principale */}
                    <div className="p-6 rounded-md mt-6 shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900">
                        <div className="grid md:grid-cols-12 grid-cols-1 gap-6 items-center">

                            {/* Image de l'œuvre */}
                            <div className="xl:col-span-4 lg:col-span-5 md:col-span-6">
                                <div className="relative w-full h-96">
                                    {/* <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain rounded-md shadow-sm dark:shadow-gray-800"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    /> */}

                                    <Image
                                        src={getImageSrc(product)}
                                        alt={product.name}
                                        fill
                                        className="object-contain rounded-md shadow-sm dark:shadow-gray-800"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            </div>

                            {/* Informations de l'œuvre */}
                            <div className="xl:col-span-8 lg:col-span-7 md:col-span-6">
                                <div className="lg:ms-6">
                                    <h5 className="text-2xl font-semibold">{product.name}</h5>

                                    {/* Prix */}
                                    <div className="mt-2">
                                        <span className="text-green-600 font-semibold text-xl me-1">
                                            {product.price?.toLocaleString()} FCFA
                                        </span>
                                        {product.oldPrice && (
                                            <del className="text-red-600 text-lg ms-2">
                                                {product.oldPrice.toLocaleString()} FCFA
                                            </del>
                                        )}
                                    </div>

                                    {/* Informations détaillées */}
                                    <div className="mt-6 space-y-4">
                                        {/* Auteur */}
                                        {product.author && (
                                            <div>
                                                <h6 className="font-semibold text-lg">Artiste :</h6>
                                                <p className="text-slate-400 mt-1">{product.author}</p>
                                            </div>
                                        )}

                                        {/* Localisation */}
                                        {product.location && (
                                            <div>
                                                <h6 className="font-semibold text-lg">Localisation :</h6>
                                                <p className="text-slate-400 mt-1">{product.location}</p>
                                            </div>
                                        )}

                                        {/* Catégorie */}
                                        {product.category && (
                                            <div>
                                                <h6 className="font-semibold text-lg">Catégorie :</h6>
                                                <p className="text-slate-400 mt-1">{product.category}</p>
                                            </div>
                                        )}

                                        {/* Contact WhatsApp */}
                                        {product.whatsapp && (
                                            <div>
                                                <h6 className="font-semibold text-lg">Contact :</h6>
                                                <a
                                                    href={`https://wa.me/${product.whatsapp}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-emerald-600 hover:text-emerald-700 mt-1 inline-flex items-center"
                                                >
                                                    <i className="mdi mdi-whatsapp text-xl me-2"></i>
                                                    WhatsApp: {product.whatsapp}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Boutons d'action */}
                                    <div className="mt-8 flex flex-wrap gap-4">
                                        <a
                                            href={`https://wa.me/${product.whatsapp}?text=Bonjour, je suis intéressé par votre œuvre "${product.name}"`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="py-3 px-6 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-md"
                                        >
                                            💬 Contacter l'artiste
                                        </a>

                                        <Link
                                            href="/"
                                            className="py-3 px-6 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center rounded-md bg-gray-600 hover:bg-gray-700 border-gray-600 hover:border-gray-700 text-white"
                                        >
                                            ← Retour aux œuvres
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Onglets de détail */}
                    <ProductDetailTab product={getProductDetails(product)} />
                </div>
            </div>
            <Switcher />
        </Wrapper>
    );

}