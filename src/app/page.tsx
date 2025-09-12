/** @format */

'use client'
import AddProduct from "@/components/add-product";
import Switcher from "@/components/switcher";
import { currency, prettyPhone, waHref } from "@/lib/functions";
import Image from "next/image";
import Link from "next/link";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Wrapper from "../components/wrapper";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"; // ← Changement ici
import { useEffect, useState } from "react";
import Alert, { Variant } from "@/components/alerte";
import ConfirmationModal from "@/components/confirmation-modal";
import AddToCartButton from "@/components/addToCartButton";

import { deleteProductAsync, fetchProductsPaginated, IProduct, setProducts, setPage } from "@/lib/redux/productsSlice";
import { useAlert } from "@/components/useAlert";
import { useAuth } from "@/lib/hooks/useAuth";



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
    console.log("🚀 ~ HomePage ~ totalPages:", totalPages)

    const { alert, showAlert, hideAlert } = useAlert();
    // const { isAdmin } = useAuth();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    // const [alert, setAlert] = useState<{ show: boolean, type: Variant, message: string }>({
    //     show: false,
    //     type: 'success',
    //     message: ''
    // });
    const [modalOpen, setModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    // Fonction pour afficher une alerte temporaire
    // const showAlert = (type: Variant, message: string) => {
    //     setAlert({ show: true, type, message });
    //     setTimeout(() => setAlert({ show: false, type, message }), 2000);
    // };

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

            // Recharger les produits après suppression
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

        // Ajuster si on est près de la fin
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

        // Première page et points de suspension si nécessaire
        if (startPage > 1) {
            buttons.push(
                <li key={1}>
                    <button
                        onClick={() => handlePageChange(1)}
                        className="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600"
                    >
                        1
                    </button>
                </li>
            );
            if (startPage > 2) {
                buttons.push(
                    <li key="ellipsis-start">
                        <span className="size-[40px] inline-flex justify-center items-center text-slate-400">
                            ...
                        </span>
                    </li>
                );
            }
        }

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

        // Dernière page et points de suspension si nécessaire
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <li key="ellipsis-end">
                        <span className="size-[40px] inline-flex justify-center items-center text-slate-400">
                            ...
                        </span>
                    </li>
                );
            }
            buttons.push(
                <li key={totalPages}>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        className="size-[40px] inline-flex justify-center items-center text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600"
                    >
                        {totalPages}
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
                        <div>
                            <h5 className="text-lg font-semibold">Nos oeuvres</h5>
                            <p className="text-sm text-gray-500">
                                {totalProducts} œuvre{totalProducts !== 1 ? 's' : ''} au total
                            </p>
                        </div>
                        <AddProduct />
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}


                    {/* CARTES - Version corrigée avec gestion des images */}
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-6 gap-5">
                        {productData.length > 0 ? (
                            productData?.map((item: IProduct) => (
                                <div
                                    key={item.id}
                                    className="group bg-white dark:bg-slate-900 rounded-md overflow-hidden shadow-sm dark:shadow-gray-700 hover:shadow-lg hover:dark:shadow-gray-700 duration-300 grid grid-rows-[3fr_1fr] h-[420px]"
                                >
                                    {/* Conteneur image avec taille fixe et padding */}
                                    <div className="relative w-full h-full p-4 bg-white dark:bg-slate-900">
                                        {/* Conteneur image avec dimensions fixes */}

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
                                                        padding: '8px'
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

                                            {/* {isAdmin && (
                                                <> */}
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
                                            {/* </>)} */}

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
                                                <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded h-5 inline-flex items-center">
                                                    New
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* 1/4 : Infos (nom, auteur, prix, whatsapp, localisation) */}
                                    <div className="p-3 flex flex-col justify-between border-t border-gray-100 dark:border-gray-700">
                                        {/* Ligne nom + prix */}

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
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <div
                                                className="text-[12px] text-slate-500 inline-flex items-center gap-1 min-w-0"
                                                title={item.author}
                                            >
                                                <i className="mdi mdi-account-outline text-[16px] text-slate-400"></i>
                                                <span className="truncate">{item.author ?? " "}</span>
                                            </div>

                                            <a
                                                href={waHref(item?.whatsapp, item)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] hover:bg-emerald-600 hover:text-white transition"
                                                title="Contacter sur WhatsApp à propos de cette œuvre"
                                                onClick={(e) => {
                                                    if (!item.whatsapp) {
                                                        e.preventDefault();
                                                        showAlert('danger', 'Numéro WhatsApp non disponible !');
                                                    }
                                                }}
                                            >
                                                <i className="mdi mdi-whatsapp text-[16px]"></i>
                                                <span className="hidden sm:inline">{prettyPhone(item.whatsapp)}</span>
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
                                    <p className="text-gray-500 text-lg">Aucune œuvre disponible pour le moment.</p>
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

{/* <Footer /> */ }

export default HomePage;
