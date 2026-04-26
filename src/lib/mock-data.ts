export interface Pharmacy {
  id: string;
  name: string;
  branch: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  address: string;
}

export const PHARMACIES: Pharmacy[] = [
  { id: "p_001", name: "صيدلية النهدي",  branch: "حي العليا",   distance: 1.2, rating: 4.8, isOpen: true,  address: "شارع العليا الرئيسي" },
  { id: "p_002", name: "صيدلية الدواء",  branch: "حي الملقا",   distance: 2.5, rating: 4.6, isOpen: true,  address: "طريق الملك فهد" },
  { id: "p_003", name: "صيدلية الحياة",  branch: "حي النخيل",   distance: 3.1, rating: 4.7, isOpen: false, address: "شارع الأمير محمد بن سعد" },
  { id: "p_004", name: "صيدلية النهدي",  branch: "حي الورود",   distance: 3.8, rating: 4.5, isOpen: true,  address: "طريق الأمير سلطان" },
  { id: "p_005", name: "صيدلية المتحدة", branch: "حي الياسمين", distance: 4.2, rating: 4.9, isOpen: true,  address: "شارع الأمير ناصر بن فرحان" },
];

export interface Reward {
  id: string;
  title: string;
  subtitle: string;
  cost: number;
  icon: "percent" | "gift" | "tree" | "star";
}

export const REWARDS: Reward[] = [
  { id: "r_001", title: "خصم ١٠٪ على الفاتورة", subtitle: "صيدلية النهدي",         cost: 100, icon: "percent" },
  { id: "r_002", title: "كوبون ٢٥ ريال",          subtitle: "صيدلية الدواء",         cost: 250, icon: "gift" },
  { id: "r_003", title: "شجرة مزروعة باسمك",      subtitle: "شراكة مع جمعية بيئية",  cost: 50,  icon: "tree" },
  { id: "r_004", title: "اشتراك Loop+ شهر",        subtitle: "ميزات إضافية وأولوية", cost: 500, icon: "star" },
];
