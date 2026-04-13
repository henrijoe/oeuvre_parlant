//src/app/shop-item-detail/[id]/page.tsx

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
import { isValidWhatsAppNumber, prettyPhone, waHref } from "@/lib/functions";
import { useAlert } from "@/components/useAlert";

export default function ShopItemDetailPage() {
    const params = useParams();
    const productId = parseInt(params.id as string);
    const products = useSelector((state: RootState) => state.products.productData);
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const { alert, showAlert, hideAlert } = useAlert();

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
        const baseDetails = {
            description: product.description || "Cette œuvre unique a été créée avec passion et expertise.",
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
                    colors: ["Personnalisable"],
                    description: product.description || "Peinture originale créée par l'artiste."
                };
            case "Sculpture":
                return {
                    ...baseDetails,
                    materials: ["Bois", "Argile", "Bronze"],
                    sizes: ["Petit", "Moyen", "Grand"],
                    description: product.description || "Sculpture unique façonnée avec talent."
                };
            case "Photographie":
                return {
                    ...baseDetails,
                    materials: ["Papier photo premium", "Encadrement"],
                    sizes: ["20x30cm", "30x40cm", "40x60cm"],
                    description: product.description || "Photographie d'art imprimée sur papier premium."
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
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <h5 className="text-lg font-semibold mt-4">Chargement de l'œuvre...</h5>
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
                            <h5 className="text-lg font-semibold">Œuvre non trouvée</h5>
                            <p className="text-slate-400 mt-2">L'œuvre que vous recherchez n'existe pas ou a été supprimée.</p>
                            <Link
                                href="/"
                                className="text-indigo-600 hover:underline mt-4 inline-block"
                            >
                                ← Retour à la galerie
                            </Link>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            {alert.show && (
                <div className="fixed top-4 right-4 z-50">
                    <div className={`p-4 rounded-md ${alert.type === 'danger' ? 'bg-red-100 border border-red-400 text-red-700' :
                            alert.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
                                'bg-blue-100 border border-blue-400 text-blue-700'
                        }`}>
                        {alert.message}
                    </div>
                </div>
            )}

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
                                <div className="relative w-full h-96 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                    <Image
                                        src={getImageSrc(product)}
                                        alt={product.name}
                                        fill
                                        className="object-contain rounded-md p-4"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority
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
                                            {product?.price?.toLocaleString() || '0'} FCFA
                                        </span>
                                        {product?.oldPrice && product.oldPrice > (product?.price || 0) && (
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

                                        {/* Description courte */}
                                        {product.description && (
                                            <div>
                                                <h6 className="font-semibold text-lg">Description :</h6>
                                                <p className="text-slate-400 mt-1 line-clamp-3">
                                                    {product.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Boutons d'action */}
                                    <div className="mt-8 flex flex-wrap gap-4">
                                        <a
                                            href={waHref(product.whatsapp, product, {
                                                defaultCallingCode: "225",
                                                keepLeadingZero: true
                                            })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                if (!isValidWhatsAppNumber(product.whatsapp || "", {
                                                    defaultCallingCode: "225",
                                                    keepLeadingZero: true
                                                })) {
                                                    e.preventDefault();
                                                    showAlert('danger', "Numéro WhatsApp invalide. Veuillez contacter l'administrateur.");
                                                }
                                            }}
                                            className="py-3 px-6 inline-flex items-center font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-md"
                                        >
                                            <i className="mdi mdi-whatsapp text-xl me-2"></i>
                                            Contacter l'artiste
                                        </a>
                                        <Link
                                            href="/"
                                            className="py-3 px-6 inline-flex items-center font-semibold tracking-wide border align-middle duration-500 text-base text-center rounded-md bg-gray-600 hover:bg-gray-700 border-gray-600 hover:border-gray-700 text-white"
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