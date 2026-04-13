
// Format FCFA
export const currency = (n?: number) =>
  typeof n === "number" ? `${n.toLocaleString("fr-FR")} FCFA` : "";


// types basiques
type CartItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  author?: string;
  whatsapp?: string;     // numéro tel saisi par l'artiste
  countryCode?: string;  // ex: "225","33" si dispo (facultatif)
  keepLeadingZero?: boolean; // override par artiste si besoin (facultatif)
  image?: string;
  sku?: string;
};


// Options pays par défaut (fallback si item n’a pas ses propres règles)
const DEFAULT_PHONE_OPTS: PhoneOpts = {
  defaultCallingCode: "225",    // CI par défaut
  keepLeadingZero: true,        // CI garde le 0
};

// Groupe = un vendeur (un numéro)
export type SellerGroup = {
  rawPhone: string;
  e164: string;           // +22505...
  wa: string;             // 22505... (format wa.me)
  pretty: string;         // +225 05 xx xx xx xx
  authorLabel: string;    // nom affiché (auteur / vendeur)
  items: CartItem[];
  subtotal: number;
};


// Items sans numéro -> on les remonte à part
export type NoPhoneGroup = {
  items: CartItem[];
  subtotal: number;
};

type MessageOpts = {
  sellerName?: string;
  paymentMethods?: string[];     // ["*Wave*", "*Mobile Money*", "*Virement bancaire*"]
  shippingModes?: string[];      // ["*Retrait en atelier*", "*Livraison locale*", "*Transporteur*"]
  preparationTime?: string;      // "24-48h"
  returnPolicy?: string;         // "Retour sous 7 jours si..."
  needInvoice?: boolean;         // true => propose facture
  askCustomerFields?: boolean;   // true => ajoute bloc à remplir par le client
};

type PhoneOpts = {
  /** Ex: "225" pour CI, "33" pour France */
  defaultCallingCode?: string;
  /**
   * Garder le 0 du numéro national quand on passe en international.
   * CI => true (ex: 05xxxxxxxx devient +22505xxxxxxxx)
   * FR/… => false (ex: 06xxxxxxxx devient +336xxxxxxxx)
   */
  keepLeadingZero?: boolean;
};

// Fonction utilitaire pour formater les numéros pour WhatsApp
export const formatPhoneForWhatsApp = (phone: string): string => {
  if (!phone) return "";
  
  // Nettoyer le numéro
  const cleanedPhone = phone.replace(/\D/g, '');
  
  // Si le numéro commence par 0 et a 10 chiffres (format local CI)
  if (cleanedPhone.startsWith('0') && cleanedPhone.length === 10) {
    return '+225' + cleanedPhone.substring(1);
  }
  
  // Si le numéro a 9 chiffres (sans le 0)
  if (cleanedPhone.length === 9) {
    return '+225' + cleanedPhone;
  }
  
  // Si le numéro a 12 chiffres avec 225 mais sans +
  if (cleanedPhone.length === 12 && cleanedPhone.startsWith('225')) {
    return '+' + cleanedPhone;
  }
  
  // Si le numéro a déjà le format international
  if (cleanedPhone.startsWith('225') && cleanedPhone.length === 12) {
    return '+' + cleanedPhone;
  }
  
  // Si le numéro commence déjà par +
  if (cleanedPhone.startsWith('+')) {
    return cleanedPhone;
  }
  
  // Par défaut, considérer comme numéro CI
  return '+225' + cleanedPhone;
};

/** Retourne +<digits> si valide, sinon null */
export const toE164 = (phone?: string, opts: PhoneOpts = {}): string | null => {
  if (!phone) return null;
  const raw = String(phone).trim();
  let d = raw.replace(/\D/g, "");

  // 00XX... -> +XX...
  if (raw.startsWith("00") && d.length >= 4) {
    return `+${d.slice(2)}`;
  }

  // +XX... déjà en international ?
  if (raw.startsWith("+")) {
    const onlyDigits = d;
    return onlyDigits.length >= 8 && onlyDigits.length <= 15 ? `+${onlyDigits}` : null;
  }

  // Si on a un indicatif par défaut, on convertit un numéro "national" en international
  if (opts.defaultCallingCode) {
    // cas général
    if (d.length >= 8 && d.length <= 11) {
      // garder/retirer le 0 de tête selon la règle du pays
      const rest = d.startsWith("0")
        ? (opts.keepLeadingZero ? d : d.slice(1))
        : d;
      const intl = `+${opts.defaultCallingCode}${rest}`;
      const digits = intl.replace(/\D/g, "");
      return digits.length >= 8 && digits.length <= 15 ? intl : null;
    }
  }

  // Peut-être que d contient déjà un indicatif sans + (ex: 22505xxxxxxx)
  if (d.length >= 10 && d.length <= 15) {
    return `+${d}`;
  }

  return null;
};

/** Format exigé par wa.me : uniquement des chiffres (pas de +) */
export const toWaNumber = (phone?: string, opts?: PhoneOpts): string | null => {
  const e164 = toE164(phone, opts);
  return e164 ? e164.slice(1) : null;
};

export const waHref = (
  phone?: string,
  item?: any,
  phoneOpts: PhoneOpts = { defaultCallingCode: "225", keepLeadingZero: true }, // CI par défaut
  messageOpts?: MessageOpts
) => {
  const wa = toWaNumber(phone, phoneOpts);
  if (!wa) return "#";
  const baseUrl = `https://wa.me/${wa}`;
  const msg = buildWaInquiryMessage(item, messageOpts);
  return `${baseUrl}?text=${encodeURIComponent(msg)}`;
};

export const buildWaInquiryMessage = (item?: any, opts: MessageOpts = {}) => {
  const {
    sellerName = "l'artiste",
    paymentMethods = ["*Wave*", "*Mobile Money*", "*Virement bancaire*"],
    shippingModes = ["*Retrait en atelier*", "*Livraison locale*", "*Transporteur / Envoi sécurisé*"],
    needInvoice = true,
  } = opts;

  const title = item?.name ? `*${item.name}*` : "*une œuvre*";
  const price =
    typeof item?.price === "number" ? ` au prix de *${currency(item.price)}*` : "";
  const ref = item?.id || item?.sku ? `\nRéf. : *${item?.sku ?? item?.id}*` : "";

  const paymentList = paymentMethods.map((m) => `• ${m}`).join("\n");
  const shipList = shippingModes.map((m) => `• ${m}`).join("\n");

  return `Bonjour 👋,

Je suis intéressé(e) par ${title}${price}.${ref}

* Pourrai-je avoir plus d'informations sur:*
- Disponibilité de l’œuvre
- Quels sont vos moyens de paiement acceptés ?*
${paymentList}

-Les modes d’expédition :*
- Je vous attends....
Merci`;
};


// Vérifier si un numéro est valide pour WhatsApp
export const isValidWhatsAppNumber = (phone: string, opts?: PhoneOpts) => {
  const e164 = toE164(phone, opts);
  return !!e164 && /^\+\d{8,15}$/.test(e164);
};

// Petit formatage lisible (xx xx xx xx xx)
/** Affichage lisible : +XX  .. (groupes par 2 pour les numéros courts type CI, sinon par 3) */
export const prettyPhone = (phone?: string, opts?: PhoneOpts): string => {
  const e164 = toE164(phone, opts);
  if (!e164) return "";
  const cc = e164.slice(1).match(/^\d{1,3}/)?.[0] || "";
  const rest = e164.slice(1 + cc.length);

  // Heuristique simple : si longueur <= 10 => groupes de 2, sinon 3
  const group2 = rest.length <= 10;
  const grouped = group2
    ? rest.replace(/(\d{2})(?=\d)/g, "$1 ").trim()
    : rest.replace(/(\d{3})(?=\d)/g, "$1 ").trim();

  return `+${cc} ${grouped}`.trim();
};


export const waHrefOrder = (phone?: string, items: any[] = [], total: number = 0) => {
  const wa = toWaNumber(phone);
  if (!wa) return "#";
  const baseUrl = `https://wa.me/${wa}`;

  if (items.length === 0) return baseUrl;

  const message = `Bonjour ! Je souhaite commander les œuvres suivantes :

*RÉCAPITULATIF DE MA COMMANDE* :

${items.map((item) =>
  `• ${item.quantity}x ${item.name} - ${currency(item.price)} (Artiste: ${item.author || 'Non spécifié'})`
).join('\n')}

💰 *TOTAL : ${currency(total)}*

📦 *INFORMATIONS DE LIVRAISON* :
Je vous communiquerai mon adresse de livraison et mes coordonnées complètes.

💳 *MODALITÉS DE PAIEMENT* :
Pourriez-vous m'indiquer les modes de paiement acceptés ?

Merci de me confirmer la disponibilité de ces œuvres et de me préciser les délais de livraison.

Cordialement`;

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
};


// ----------Partie du panier-------------------

// Règles de numérotation à utiliser pour UN item (priorité à l'item, sinon défaut global)
export const phoneOptsForItem = (it: Partial<CartItem>): PhoneOpts => ({
  defaultCallingCode:
    it.countryCode && String(it.countryCode).trim() !== ""
      ? String(it.countryCode).trim()
      : DEFAULT_PHONE_OPTS.defaultCallingCode,

  keepLeadingZero:
    typeof it.keepLeadingZero === "boolean"
      ? it.keepLeadingZero
      : DEFAULT_PHONE_OPTS.keepLeadingZero,
});


// 1) Grouper par vendeur
export const groupCartBySeller = (items: CartItem[]) => {
  const groups: Record<string, SellerGroup> = {};
  const noPhone: NoPhoneGroup = { items: [], subtotal: 0 };

  for (const it of items) {
    const phone = (it.whatsapp || "").trim();
    if (!phone) {
      noPhone.items.push(it);
      noPhone.subtotal += (it.price || 0) * (it.quantity || 1);
      continue;
    }

    const wa = toWaNumber(phone, phoneOptsForItem(it));
    const e164 = toE164(phone, phoneOptsForItem(it));
    if (!wa || !e164) {
      // numéro invalide -> on traite comme “sans numéro”
      noPhone.items.push(it);
      noPhone.subtotal += (it.price || 0) * (it.quantity || 1);
      continue;
    }

    const key = wa; // clé unique par numéro normalisé
    if (!groups[key]) {
      groups[key] = {
        rawPhone: phone,
        e164,
        wa,
        pretty: prettyPhone(phone, phoneOptsForItem(it)),
        authorLabel: it.author || "Vendeur",
        items: [],
        subtotal: 0,
      };
    }
    groups[key].items.push(it);
    groups[key].subtotal += (it.price || 0) * (it.quantity || 1);
  }

  const sellerGroups = Object.values(groups);
  return { sellerGroups, noPhone };
};


// 2) Message commande pour UN vendeur (groupe)
export const buildWaOrderMessageForGroup = (
  group: SellerGroup,
  opts: MessageOpts = {}
) => {
  const {
    sellerName = group.authorLabel,
    paymentMethods = ["*Wave*", "*Mobile Money*", "*Virement bancaire*"],
    shippingModes = ["*Retrait en atelier*", "*Livraison locale*", "*Transporteur / Envoi sécurisé*"],
  } = opts;

  const lines = group.items.map(it =>
    `• ${it.quantity}× ${it.name}${it.sku ? ` (Réf. ${it.sku})` : ""} — ${currency(it.price)}`
  ).join("\n");

  const paymentList = paymentMethods.map(m => `• ${m}`).join("\n");
  const shipList    = shippingModes.map(m => `• ${m}`).join("\n");

  return `Bonjour 👋,

Je souhaite commander les œuvres suivantes chez *${sellerName}* :

${lines}

💰 *SOUS-TOTAL :* ${currency(group.subtotal)}

*Moyens de paiement :*
${paymentList}

*Modes d’expédition :*
${shipList}

Merci 🙏`;
};

// 3) URL WhatsApp pour UN vendeur (groupe)
export const waHrefForSellerGroup = (
  group: SellerGroup,
  messageOpts?: MessageOpts
) => {
  const base = `https://wa.me/${group.wa}`;
  const msg = buildWaOrderMessageForGroup(group, messageOpts);
  return `${base}?text=${encodeURIComponent(msg)}`;
};