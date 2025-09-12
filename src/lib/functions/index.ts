import { IProduct } from "../redux/productsSlice";

// Format FCFA
export const currency = (n?: number) =>
  typeof n === "number" ? `${n.toLocaleString("fr-FR")} FCFA` : "";


export const waHref = (phone?: string, product?: IProduct) => {
  if (!phone) return "#";

  const cleanedPhone = phone.replace(/\D/g, '');
  const baseUrl = `https://wa.me/${cleanedPhone}`;

  if (!product) return baseUrl;

  const message = `Bonjour ! Je suis intéressé par votre œuvre "${product.name}".

  Détails de l'œuvre :
 - Nom : ${product.name}
 - Prix : ${product.price ? currency(product.price) : 'Non spécifié'}
 - Catégorie : ${product.category ?? 'Non spécifiée'}
 - Artiste : ${product.author ?? 'Non spécifié'}

Pourriez-vous m'informer sur :
• La disponibilité de cette œuvre
• Les conditions d'acquisition
• Les modalités d'achat
• Les options d'expédition/livraison
• Les moyens de paiement acceptés

 Merci !`;

  const encodedMessage = encodeURIComponent(message);

  return `${baseUrl}?text=${encodedMessage}`;
};

// Petit formatage lisible (xx xx xx xx xx)
export const prettyPhone = (p?: string) => {
  if (!p) return "";
  const d = (p.match(/\d/g) || []).join("");
  return d.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
};


// lib/functions.ts
export const waHrefOrder = (phone?: string, items: any[] = [], total: number = 0) => {
  if (!phone) return "#";
  
  const cleanedPhone = phone.replace(/\D/g, '');
  const baseUrl = `https://wa.me/${cleanedPhone}`;
  
  if (items.length === 0) return baseUrl;
  
  // Créer le message de commande
  const message = `Bonjour ! Je souhaite commander les œuvres suivantes :

🛒 *RÉCAPITULATIF DE MA COMMANDE* :

${items.map((item, index) => 
  `• ${item.quantity}x ${item.name} - ${currency(item.price)} (Artiste: ${item.author || 'Non spécifié'})`
).join('\n')}

💰 *TOTAL : ${currency(total)}*

📦 *INFORMATIONS DE LIVRAISON* :
Je vous communiquerai mon adresse de livraison et mes coordonnées complètes.

💳 *MODALITÉS DE PAIEMENT* :
Pourriez-vous m'indiquer les modes de paiement acceptés ?

Merci de me confirmer la disponibilité de ces œuvres et de me préciser les délais de livraison.

Cordialement`;

  const encodedMessage = encodeURIComponent(message);
  
  return `${baseUrl}?text=${encodedMessage}`;
};

// lib/functions.ts
export const waHrefMultiArtists = (items: any[] = [], total: number = 0) => {
  // Grouper les articles par artiste/whatsapp
  const artistsMap: { [key: string]: any[] } = {};
  
  items.forEach(item => {
    const artistKey = item.whatsapp || item.author || 'inconnu';
    if (!artistsMap[artistKey]) {
      artistsMap[artistKey] = [];
    }
    artistsMap[artistKey].push(item);
  });
  
  const artistKeys = Object.keys(artistsMap);
  
  if (artistKeys.length === 0) return "#";
  
  // Message pour multiple artistes
  const message = `Bonjour ! 

Je souhaite commander plusieurs œuvres de différents artistes. Pourriez-vous me conseiller sur la procédure ?

🛒 *MES ARTICLES* :
${items.map(item => 
  `• ${item.quantity}x ${item.name} - ${currency(item.price)} (${item.author || 'Artiste inconnu'})`
).join('\n')}

💰 *TOTAL GLOBAL : ${currency(total)}*

Merci de m'indiquer comment procéder pour cette commande multiple.`;

  // Prendre le premier numéro disponible
  const firstArtistWithPhone = items.find(item => item.whatsapp);
  if (firstArtistWithPhone) {
    const cleanedPhone = firstArtistWithPhone.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
  }
  
  return "#";
};
