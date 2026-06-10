export const BAR_INFO = [
  {
    content:
      'Bar Wise es un bar-restaurante ubicado en Buenos Aires, Argentina. ' +
      'Ofrecemos una amplia carta con comidas, bebidas y tragos artesanales. ' +
      'El ambiente es ideal para compartir con amigos y familia.',
    metadata: { type: 'info', section: 'general' },
  },
  {
    content:
      'Horarios de Bar Wise: lunes a viernes de 12:00 a 00:00 hs. ' +
      'Sabados y domingos de 12:00 a 02:00 hs.',
    metadata: { type: 'info', section: 'horarios' },
  },
  {
    content:
      'Para reservas y consultas en Bar Wise, contactanos a traves de nuestras ' +
      'redes sociales o visitanos en persona en Buenos Aires, Argentina. ' +
      'También podes dejar tu reseña en la seccion de Reseñas de la app.',
    metadata: { type: 'info', section: 'contacto' },
  },
  {
    content:
      'El menu de Bar Wise tiene tres secciones: ' +
      'COMIDAS (entradas, principales, guarniciones, pizzas, sandwiches), ' +
      'BEBIDAS (cervezas, vinos, espumantes, bebidas sin alcohol) y TRAGOS. ' +
      'Ademas tenemos sugerencias del chef que cambian periodicamente.',
    metadata: { type: 'info', section: 'menu_general' },
  },
];

export function buildFoodContent(food: Record<string, unknown>): string {
  const parts = [`${food.type}: ${food.title ?? 'Sin nombre'}`];
  if (food.description) parts.push(food.description as string);
  if (food.price != null) parts.push(`Precio: $${food.price}`);
  if (food.subFoodType) parts.push(`Categoria: ${food.subFoodType}`);
  return parts.join('. ');
}

export function buildSuggestionContent(sug: Record<string, unknown>): string {
  const parts = [`Sugerencia del chef: ${sug.title ?? 'Sin nombre'}`];
  if (sug.description) parts.push(sug.description as string);
  if (sug.price != null) parts.push(`Precio: $${sug.price}`);
  return parts.join('. ');
}
