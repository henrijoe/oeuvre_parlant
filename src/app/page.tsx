/** @format */

'use client'
import AddProduct from "@/components/add-product";
import Switcher from "@/components/switcher";
import { currency, isValidWhatsAppNumber, prettyPhone, waHref } from "@/lib/functions";
import Image from "next/image";
import Link from "next/link";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdSearch } from "react-icons/md";
import Wrapper from "../components/wrapper";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";
import Alert, { Variant } from "@/components/alerte";
import ConfirmationModal from "@/components/confirmation-modal";
import AddToCartButton from "@/components/addToCartButton";

import { deleteProductAsync, fetchProductsPaginated, IProduct, setProducts, setPage } from "@/lib/redux/productsSlice";
import { useAlert } from "@/components/useAlert";

const HomePage = () => {
    const dispatch = useAppDispatch();

    const {
        productData,
        loading,
        error,
        totalPages,
        currentPage,
        totalProducts
    } = useAppSelector((state) => state.products);

    const { alert, showAlert, hideAlert } = useAlert();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    // États pour les filtres
    const [filters, setFilters] = useState({
        author: '',
        price: '',
        category: '',
        sort: '',
        search: ''
    });

    // Extraire les valeurs uniques pour les filtres
    const authors = [...new Set(productData.map(product => product.author).filter(Boolean))];
    const categories = [...new Set(productData.map(product => product.category).filter(Boolean))];

    // Fonction pour filtrer les produits
    const filteredProducts = productData.filter(product => {
        // Filtre par auteur
        if (filters.author && product.author !== filters.author) return false;

        // Filtre par catégorie
        if (filters.category && product.category !== filters.category) return false;

        // Filtre par recherche
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const matchesName = product.name?.toLowerCase().includes(searchTerm);
            const matchesAuthor = product.author?.toLowerCase().includes(searchTerm);
            const matchesCategory = product.category?.toLowerCase().includes(searchTerm);
            const matchesDescription = product.description?.toLowerCase().includes(searchTerm);

            if (!matchesName && !matchesAuthor && !matchesCategory && !matchesDescription) {
                return false;
            }
        }

        return true;
    });

    // Fonction pour trier les produits
    const sortedAndFilteredProducts = [...filteredProducts].sort((a, b) => {
        if (filters.sort === 'price-high') {
            return (b.price || 0) - (a.price || 0);
        } else if (filters.sort === 'price-low') {
            return (a.price || 0) - (b.price || 0);
        }
        return 0;
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            author: '',
            price: '',
            category: '',
            sort: '',
            search: ''
        });
    };

    // Fonction pour ouvrir la modal de confirmation
    const openDeleteModal = (productId: number) => {
        setProductToDelete(productId);
        setModalOpen(true);
    };

    // Fonction pour fermer la modal
    const closeModal = () => {
        setModalOpen(false);
        setProductToDelete(null);
    };

    // Fonction pour supprimer un produit
    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        setDeletingId(productToDelete);
        closeModal();

        try {
            await dispatch(deleteProductAsync(productToDelete)).unwrap();
            showAlert('success', 'Œuvre supprimée avec succès !');
            dispatch(fetchProductsPaginated(currentPage));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showAlert('danger', 'Erreur lors de la suppression de l\'œuvre !');
        } finally {
            setDeletingId(null);
        }
    };

    // Fonction pour changer de page
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(setPage(newPage));
            dispatch(fetchProductsPaginated(newPage));
        }
    };

    // Générer les boutons de pagination
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Bouton précédent
        buttons.push(
            <li key="prev">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-s-lg border border-gray-100 dark:border-gray-700 ${currentPage !== 1
                        ? 'hover:text-white hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600'
                        : 'opacity-50 cursor-not-allowed'
                        }`}
                >
                    <MdKeyboardArrowLeft className="text-[20px] rtl:rotate-180 rtl:-mt-1" />
                </button>
            </li>
        );

        // Pages numérotées
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <li key={i}>
                    <button
                        onClick={() => handlePageChange(i)}
                        aria-current={i === currentPage ? "page" : undefined}
                        className={[
                            "size-[40px] inline-flex justify-center items-center border",
                            i === currentPage
                                ? "z-10 text-white bg-indigo-600 border-indigo-600"
                                : "text-slate-400 hover:text-white bg-white dark:bg-slate-900 border-gray-100 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600",
                        ].join(" ")}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        // Bouton suivant
        buttons.push(
            <li key="next">
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-e-lg border border-gray-100 dark:border-gray-700 ${currentPage !== totalPages
                        ? 'hover:text-white hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600'
                        : 'opacity-50 cursor-not-allowed'
                        }`}
                >
                    <MdKeyboardArrowRight className="text-[20px] rtl:rotate-180 rtl:-mt-1" />
                </button>
            </li>
        );

        return buttons;
    };

    // Charger les produits au montage et quand la page change
    useEffect(() => {
        dispatch(fetchProductsPaginated(currentPage));
    }, [dispatch, currentPage]);

    return (
        <Wrapper>
            <ConfirmationModal
                isOpen={modalOpen}
                onClose={closeModal}
                onConfirm={handleDeleteProduct}
                title="Confirmation de suppression"
                message="Êtes-vous sûr de vouloir supprimer cette œuvre ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
            />

            {alert.show && (
                <div className="fixed top-4 right-4 z-50">
                    <Alert
                        variant={alert.type}
                        dismissible
                    >
                        {alert.message}
                    </Alert>
                </div>
            )}

            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="md:flex justify-between items-center">
                        <div className="flex gap-2">
                            <h5 className="text-lg font-semibold">Nos oeuvres</h5>
                            {/* <p className="text-sm text-gray-500">
                                {sortedAndFilteredProducts.length} œuvre{sortedAndFilteredProducts.length !== 1 ? 's' : ''} affichée{sortedAndFilteredProducts.length !== 1 ? 's' : ''} sur {totalProducts} au total
                            </p> */}
                        </div>
                        <AddProduct />
                    </div>

                    {/* FILTRES - Version responsive améliorée */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-1 sm:p-1 border border-gray-200 dark:border-gray-700 mt-4">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full lg:w-auto">
                                {/* Filtre par auteur */}
                                <div className="flex flex-col">
                                    {/* <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Auteur
                                    </label> */}
                                    <select
                                        value={filters.author}
                                        onChange={(e) => handleFilterChange('author', e.target.value)}
                                        className="form-select w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-700 dark:focus:border-indigo-600 focus:ring-0 text-sm"
                                    >
                                        <option value="">Tous les auteurs</option>
                                        {authors.map(author => (
                                            <option key={author} value={author}>
                                                {author}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtre par catégorie */}
                                <div className="flex flex-col">
                                    {/* <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Catégorie
                                    </label> */}
                                    <select
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="form-select w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-700 dark:focus:border-indigo-600 focus:ring-0 text-sm"
                                    >
                                        <option value="">Toutes les catégories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tri par prix */}
                                <div className="flex flex-col">
                                    {/* <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Trier par
                                    </label> */}
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="form-select w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-700 dark:focus:border-indigo-600 focus:ring-0 text-sm"
                                    >
                                        <option value="">Par défaut</option>
                                        <option value="price-high">Prix élevé</option>
                                        <option value="price-low">Prix bas</option>
                                    </select>
                                </div>

                                {/* Barre de recherche */}
                                <div className="flex flex-col sm:col-span-2 lg:col-span-1 xl:col-span-2">
                                    {/* <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Rechercher
                                    </label> */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                            placeholder="Nom, auteur, catégorie..."
                                            className="form-input w-full py-2 px-3 pl-10 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-700 dark:focus:border-indigo-600 focus:ring-0 text-sm"
                                        />
                                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                    </div>
                                </div>


                            </div>

                            {/* Bouton réinitialiser */}
                            <div className="flex justify-end lg:justify-start mt-2 lg:mt-0 lg:pl-4 gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1  dark:bg-slate-900 dark:text-slate-200">
                                   Total {sortedAndFilteredProducts.length} sur {totalProducts} 
                                </label>
                                {(filters.author || filters.category || filters.sort || filters.search) && (
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-colors whitespace-nowrap"
                                    >
                                        Réinitialiser
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* CARTES */}
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-6 gap-5">
                        {sortedAndFilteredProducts.length > 0 ? (
                            sortedAndFilteredProducts?.map((item: IProduct) => (
                                <div
                                    key={item.id}
                                    className="group bg-white dark:bg-slate-900 rounded-md overflow-hidden shadow-sm dark:shadow-gray-700 hover:shadow-lg hover:dark:shadow-gray-700 duration-300 grid grid-rows-[3fr_1fr] h-[420px]"
                                >
                                    {/* Conteneur image avec taille fixe et padding */}
                                    <div className="relative w-full h-full p-4 bg-white dark:bg-slate-900">
                                        <div className="relative w-full h-full">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                    className="object-contain"
                                                    style={{
                                                        objectFit: 'contain',
                                                        padding: '3px'
                                                    }}
                                                    priority={item.id <= 3}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-slate-800">
                                                    <span className="text-slate-400">Image non disponible</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions droites (hover) */}
                                        <ul className="list-none absolute top-4 right-4 opacity-0 group-hover:opacity-100 duration-300">
                                            <li>
                                                <button
                                                    className="size-8 inline-flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 text-white"
                                                    title="Favori"
                                                >
                                                    <i className="mdi mdi-heart"></i>
                                                </button>
                                            </li>
                                            <li className="mt-1">
                                                <Link
                                                    href={`/shop-item-detail/${item.id}`}
                                                    className="size-8 inline-flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 text-white"
                                                    title="Voir"
                                                >
                                                    <i className="mdi mdi-eye-outline"></i>
                                                </Link>
                                            </li>
                                            <li className="mt-1">
                                                <button
                                                    onClick={() => openDeleteModal(item.id)}
                                                    disabled={deletingId === item.id}
                                                    className="size-8 inline-flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 border border-red-600 text-white transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                                                    title="Supprimer"
                                                >
                                                    {deletingId === item.id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    ) : (
                                                        <i className="mdi mdi-delete-outline"></i>
                                                    )}
                                                </button>
                                            </li>
                                            <li className="mt-1">
                                                <Link
                                                    href={`/edit-product/${item.id}`}
                                                    className="size-8 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 border border-blue-600 text-white "
                                                    title="Éditer"
                                                >
                                                    <i className="mdi mdi-pencil-outline"></i>
                                                </Link>
                                            </li>
                                        </ul>

                                        {/* Badge gauche */}
                                        <ul className="list-none absolute top-4 left-4">
                                            <li>
                                                {/* <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded h-5 inline-flex items-center">
                                                    New
                                                </span> */}
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Infos (nom, auteur, prix, whatsapp, localisation) */}
                                    <div className="p-3 flex flex-col justify-between border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-start justify-between gap-3">
                                            <Link
                                                href={`/shop-item-detail/${item.id}`}
                                                className="text-[15px] font-semibold hover:text-indigo-600 line-clamp-1"
                                                title={item?.name || ''}
                                            >
                                                {item?.name || ''}
                                            </Link>

                                            <div className="text-right shrink-0">
                                                <div className="text-green-600 font-semibold leading-tight">
                                                    {currency(item?.price || 0)}
                                                </div>
                                                {item.oldPrice ? (
                                                    <div className="text-[11px] text-red-600 leading-none">
                                                        <del>{currency(item?.oldPrice)}</del>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        {/* Auteur + WhatsApp + Lieu */}
                                        {/* Auteur + WhatsApp + Lieu */}
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <div
                                                className="text-[12px] text-slate-500 inline-flex items-center gap-1 min-w-0"
                                                title={item.author}
                                            >
                                                <i className="mdi mdi-account-outline text-[16px] text-slate-400"></i>
                                                <span className="truncate">{item.author ?? " "}</span>
                                            </div>

                                            <a
                                                href={waHref(item?.whatsapp, item, { defaultCallingCode: "225", keepLeadingZero: true })}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    if (!isValidWhatsAppNumber(item.whatsapp || "", { defaultCallingCode: "225", keepLeadingZero: true })) {
                                                        e.preventDefault();
                                                        showAlert('danger', "Numéro WhatsApp invalide ou sans indicatif pays.");
                                                    }
                                                }}
                                                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] hover:bg-emerald-600 hover:text-white transition"
                                            >
                                                <i className="mdi mdi-whatsapp text-[16px] text-emerald-600 sm:text-inherit" />
                                                <span className="hidden sm:inline">
                                                    {prettyPhone(item.whatsapp, { defaultCallingCode: "225", keepLeadingZero: true })}
                                                </span>
                                            </a>
                                        </div>

                                        <div className="mt-3">
                                            <AddToCartButton
                                                product={item}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !loading && (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 text-lg">Aucune œuvre ne correspond aux critères sélectionnés.</p>
                                </div>
                            )
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-end mt-6">
                            <nav aria-label="Page navigation example">
                                <ul className="inline-flex items-center -space-x-px">
                                    {renderPaginationButtons()}
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            <Switcher />
        </Wrapper>
    );
};

export default HomePage;