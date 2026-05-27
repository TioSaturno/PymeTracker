export const CATEGORIAS_LOCALES = [
  { value: "hamburgueseria", label: "Hamburguesería" },
  { value: "pizzeria", label: "Pizzería" },
  { value: "sushi", label: "Sushi" },
  { value: "sandwicheria_completos", label: "Sándwichería / Completos" },
  { value: "alitas_de_pollo", label: "Alitas de Pollo" },
  { value: "comida_china_chifa", label: "Comida China / Chifa" },
  { value: "comida_thai", label: "Comida Thai" },
  { value: "ramen_japones", label: "Ramen / Comida Japonesa" },
  { value: "comida_coreana", label: "Comida Coreana" },
  { value: "restaurant_peruano", label: "Restaurant Peruano" },
  { value: "restaurant_mexicano", label: "Restaurant Mexicano" },
  { value: "restaurant_venezolano", label: "Restaurant Venezolano" },
  { value: "mariscos_comida_de_mar", label: "Mariscos / Comida de Mar" },
  { value: "picada_chilena", label: "Picada Chilena / Comida Casera" },
  { value: "vegano_vegetariano", label: "Vegano / Vegetariano" },
  { value: "cafeteria", label: "Café / Cafetería" },
  { value: "pasteleria_panaderia", label: "Pastelería / Panadería" },
  { value: "heladeria", label: "Heladería" },
  { value: "restaurant_arabe", label: "Restaurant Mediterráneo / Árabe" },
] as const;

export type CategoriaLocal = (typeof CATEGORIAS_LOCALES)[number]["value"];
