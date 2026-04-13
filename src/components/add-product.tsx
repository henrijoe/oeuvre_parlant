"use client"
import { addProductAsync } from "@/lib/redux/productsSlice";
import React, { useRef, useState } from "react";
import * as Icon from 'react-feather';
import { AiOutlineClose } from "react-icons/ai";
import { FiDollarSign } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useAlert } from "./useAlert";
import { CancelButton } from "./buttons/cancelButton";
import { SaveButton } from "./buttons/saveButton";

import ButtonWithSpinner from '@/components/buttonWithSpinner';
import { FiSave } from 'react-icons/fi';
import { useAuth } from "@/lib/hooks/useAuth";


interface IProductForm {
  name: string;
  price: string;
  label: string;
  author: string;
  location: string;
  whatsapp: string;
  category: string;
  description: string;
}

export default function AddProduct() {
  const dispatch = useDispatch();
  const [modal, setModal] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<string | undefined>();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Utilisation du hook useAlert
  const { alert, showAlert, hideAlert } = useAlert();
  // const { isAdmin } = useAuth();
  
  const [formData, setFormData] = useState<IProductForm>({
    name: '',
    price: '',
    label: '',
    author: '',
    location: '',
    whatsapp: '',
    category: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setUploadFile(URL.createObjectURL(selectedFile));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      if (file) {
        formDataToSend.append('image', file);
      }
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('whatsapp', formData.whatsapp);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);

      await dispatch(addProductAsync(formDataToSend) as any);

      // Afficher l'alerte de succès
      showAlert('success', 'Œuvre ajoutée avec succès !');

      setModal(false);
      resetForm();
    } catch (err: any) {
      // Afficher l'alerte d'erreur
      showAlert('danger', err.message || 'Une erreur est survenue lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      label: '',
      author: '',
      location: '',
      whatsapp: '',
      category: '',
      description: '',
    });
    setUploadFile(undefined);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseModal = () => {
    setModal(false);
    hideAlert(); // Cacher l'alerte quand on ferme le modal
  };

  return (
    <>
      <div>
        <button
          onClick={() => setModal(true)}
          className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-800/5 hover:bg-gray-800/10 dark:bg-gray-700 border border-gray-800/5 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
        >
          <Icon.Plus className="size-4" />
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed z-50 flex items-center justify-center inset-0 bg-gray-900/70 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-gray-700 flex flex-col max-h-[inherit]">
              {/* En-tête du modal */}
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 shrink-0">
                <h5 className="text-xl font-semibold">Ajouter une œuvre</h5>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ms-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <AiOutlineClose className="size-5" />
                </button>
              </div>

              {/* Contenu du modal avec défilement */}
              <div className="p-4 overflow-y-auto flex-1">
                <div>
                  <p className="font-semibold mb-4">Téléchargez l'image de votre œuvre :</p>
                  {uploadFile ? (
                    <div className="preview-box flex justify-center rounded-md shadow dark:shadow-gray-800 overflow-hidden bg-gray-50 dark:bg-slate-800 p-2 w-full max-h-60">
                      <img src={uploadFile} alt="Preview" className="max-h-56 object-contain" />
                    </div>
                  ) : (
                    <div className="preview-box flex justify-center items-center rounded-md shadow dark:shadow-gray-800 overflow-hidden bg-gray-50 dark:bg-slate-800 text-slate-400 p-4 text-center w-full h-40">
                      Formats supportés : JPG, PNG. Taille max : 10MB.
                    </div>
                  )}
                  <input
                    type="file"
                    id="input-file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <label
                    htmlFor="input-file"
                    className="btn-upload py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md mt-6 cursor-pointer"
                  >
                    Choisir une image
                  </label>
                </div>

                <form id="product-form" onSubmit={handleSubmit} className="mt-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12">
                      <label className="font-semibold">Nom de l'œuvre <span className="text-red-600">*</span></label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0 mt-2"
                        placeholder="Nom de l'œuvre"
                        required
                      />
                    </div>

                    <div className="md:col-span-6 col-span-12">
                      <label className="form-label font-semibold">Prix (FCFA)</label>
                      <div className="relative mt-2">
                        <span className="absolute top-0.5 start-0.5 size-9 text-xl bg-gray-100 dark:bg-slate-800 inline-flex justify-center items-center text-dark dark:text-white rounded">
                          <FiDollarSign />
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="form-input ps-12 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0"
                          placeholder="Prix"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-6 col-span-12">
                      <label className="font-semibold">Auteur</label>
                      <input
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0 mt-2"
                        placeholder="Nom de l'auteur"
                      />
                    </div>

                    <div className="col-span-12">
                      <label className="font-semibold">Localisation</label>
                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0 mt-2"
                        placeholder="Pays, ville"
                      />
                    </div>

                    <div className="col-span-12">
                      <label className="font-semibold">Contact WhatsApp</label>
                      <input
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0 mt-2"
                        placeholder="Numéro WhatsApp"
                      />
                    </div>

                    <div className="col-span-12">
                      <label className="font-semibold">Catégorie</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-select w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0 mt-2"
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

                    <div className="col-span-12">
                      <label className="font-semibold">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="form-textarea w-full py-2 px-3 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-200 focus:border-indigo-600 dark:border-gray-800 dark:focus:border-indigo-600 focus:ring-0 mt-2"
                        placeholder="Description détaillée de l'œuvre"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Pied de modal fixe avec les boutons */}
              <div className="p-4 border-t dark:border-gray-700 shrink-0">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-gray-600 hover:bg-gray-700 border-gray-600 hover:border-gray-700 text-white rounded-md flex-1"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    form="product-form"
                    disabled={loading}
                    className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Ajout en cours...' : 'Ajouter l\'œuvre'}
                  </button>


                  {/* <CancelButton
                    onClick={handleCloseModal}
                    disabled={loading}
                  />
                  <SaveButton
                    loading={loading}
                    disabled={loading}
                    onClick={handleSubmit}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}