"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from 'react-feather';


interface ProductDetailTabProps {
    product?: {
        description?: string;
        sizes?: string[];
        colors?: string[];
        materials?: string[];
        reviews?: {
            image: string;
            name: string;
            time: string;
            review: string;
            rating: number;
        }[];
    };
}

export default function ProductDetailTab({ product }: ProductDetailTabProps) {

    // Valeurs par défaut si product est undefined
    const productData = product || {
        description: "",
        sizes: [],
        colors: [],
        materials: [],
        reviews: []
    };

    const [activeIndex, setActiveIndex] = useState(0);
    const [review, setReview] = useState({
        name: '',
        email: '',
        comment: '',
        rating: 5
    });

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReview(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        // Ici vous pourriez envoyer le commentaire à votre API ou store
        console.log("Nouveau commentaire:", review);
        setReview({
            name: '',
            email: '',
            comment: '',
            rating: 5
        });
        alert("Merci pour votre commentaire!");
    };

    return (
        <div className="grid md:grid-cols-12 grid-cols-1 mt-6 gap-6">
            <div className="lg:col-span-3 md:col-span-5">
                <div className="sticky top-20">
                    <ul className="flex-column p-6 bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 rounded-md">
                        <li role="presentation">
                            <button
                                onClick={() => setActiveIndex(0)}
                                className={`px-4 py-2 text-start text-base font-semibold rounded-md w-full hover:text-indigo-600 duration-500 ${activeIndex === 0 ? 'bg-indigo-600 text-white hover:text-white' : ''}`}
                            >
                                Description
                            </button>
                        </li>
                        <li role="presentation">
                            <button
                                onClick={() => setActiveIndex(1)}
                                className={`px-4 py-2 text-start text-base font-semibold rounded-md w-full hover:text-indigo-600 duration-500 ${activeIndex === 1 ? 'bg-indigo-600 text-white hover:text-white' : ''}`}
                            >
                                Informations supplémentaires
                            </button>
                        </li>
                        <li role="presentation">
                            <button
                                onClick={() => setActiveIndex(2)}
                                className={`px-4 py-2 text-start text-base font-semibold rounded-md w-full hover:text-indigo-600 duration-500 ${activeIndex === 2 ? 'bg-indigo-600 text-white hover:text-white' : ''}`}
                            >
                                Avis
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="lg:col-span-9 md:col-span-7">
                <div className="p-6 bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 rounded-md">
                    {activeIndex === 0 && (
                        <div>
                            <p className="text-slate-400">
                                {productData.description || "Aucune description disponible pour cette œuvre."}
                            </p>
                        </div>
                    )}

                    {activeIndex === 1 && (
                        <div>
                            <table className="w-full text-start">
                                <tbody>
                                    {productData.colors && (
                                        <tr className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700">
                                            <td className="font-semibold py-4" style={{ width: "200px" }}>Couleurs</td>
                                            <td className="text-slate-400 py-4">
                                                {productData.colors.join(", ")}
                                            </td>
                                        </tr>
                                    )}

                                    {productData.materials && (
                                        <tr className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700">
                                            <td className="font-semibold py-4">Matériaux</td>
                                            <td className="text-slate-400 py-4">
                                                {productData.materials.join(", ")}
                                            </td>
                                        </tr>
                                    )}

                                    {productData.sizes && (
                                        <tr className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700">
                                            <td className="font-semibold py-4">Tailles</td>
                                            <td className="text-slate-400 py-4">
                                                {productData.sizes.join(", ")}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeIndex === 2 && (
                        <div>
                            {productData.reviews?.length ? (
                                productData.reviews.map((item, index) => (
                                    <div key={index} className="mb-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Image
                                                    src={item.image}
                                                    width={44}
                                                    height={44}
                                                    className="size-11 rounded-full shadow"
                                                    alt={item.name}
                                                />
                                                <div className="ms-3 flex-1">
                                                    <div className="text-lg font-semibold">{item.name}</div>
                                                    <p className="text-sm text-slate-400">{item.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-md shadow-sm dark:shadow-gray-700 mt-4">
                                            <div className="flex items-center mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`mdi mdi-star text-lg ${i < item.rating ? 'text-orange-400' : 'text-gray-300'}`}
                                                    ></i>
                                                ))}
                                            </div>
                                            <p className="text-slate-400 italic">{item.review}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400">Aucun avis pour le moment.</p>
                            )}

                            <div className="p-6 rounded-md shadow-sm dark:shadow-gray-700 mt-8">
                                <h5 className="text-lg font-semibold">Laisser un commentaire :</h5>

                                <form onSubmit={handleSubmitReview} className="mt-8">
                                    <div className="grid lg:grid-cols-12 lg:gap-6">
                                        <div className="lg:col-span-6 mb-5">
                                            <div className="text-start">
                                                <label htmlFor="name" className="font-semibold">Votre nom :</label>
                                                <div className="form-icon relative mt-2">
                                                    <Icon.User className="size-4 absolute top-3 start-4" />
                                                    <input
                                                        name="name"
                                                        value={review.name}
                                                        onChange={handleReviewChange}
                                                        type="text"
                                                        className="form-input ps-11 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0"
                                                        placeholder="Votre nom"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-6 mb-5">
                                            <div className="text-start">
                                                <label htmlFor="email" className="font-semibold">Votre email :</label>
                                                <div className="form-icon relative mt-2">
                                                    <Icon.Mail className="size-4 absolute top-3 start-4" />
                                                    <input
                                                        name="email"
                                                        value={review.email}
                                                        onChange={handleReviewChange}
                                                        type="email"
                                                        className="form-input ps-11 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0"
                                                        placeholder="Votre email"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <div className="text-start">
                                            <label htmlFor="comment" className="font-semibold">Votre commentaire :</label>
                                            <div className="form-icon relative mt-2">
                                                <Icon.MessageCircle className="size-4 absolute top-3 start-4" />
                                                <textarea
                                                    name="comment"
                                                    value={review.comment}
                                                    onChange={handleReviewChange}
                                                    className="form-input ps-11 w-full py-2 px-3 h-28 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0"
                                                    placeholder="Votre commentaire"
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label className="font-semibold">Note :</label>
                                        <div className="flex items-center mt-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReview({ ...review, rating: star })}
                                                    className="text-2xl mr-1"
                                                >
                                                    {star <= review.rating ? '★' : '☆'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="py-2 px-5 inline-block tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md w-full"
                                    >
                                        Envoyer le commentaire
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}