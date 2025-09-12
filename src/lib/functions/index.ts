
// Format FCFA
export const currency = (n?: number) =>
  typeof n === "number" ? `${n.toLocaleString("fr-FR")} FCFA` : "";

// Lien WhatsApp : on normalise le numéro en +225 si nécessaire
export const waHref = (p?: string) => {
  if (!p) return "#";

  // Nettoyer les chiffres
  const digits = (p.match(/\d/g) || []).join("");

  // Vérifier si c'est bien un numéro ivoirien
  const validPrefixes = ["01", "05", "07"];
  const prefix = digits.slice(0, 2);

  if (!validPrefixes.includes(prefix)) {
    console.warn("Numéro invalide pour la Côte d'Ivoire :", digits);
    return "#";
  }

  // Retirer le zéro du début si présent
  const localNumber = digits

  // Ajouter l’indicatif Côte d’Ivoire
  return `https://wa.me/225${localNumber}`;
};

// Petit formatage lisible (xx xx xx xx xx)
export const prettyPhone = (p?: string) => {
  if (!p) return "";
  const d = (p.match(/\d/g) || []).join("");
  return d.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
};


